# syntax=docker/dockerfile:1

################################################################################
# base — shared by all stages.
################################################################################
FROM node:24-slim AS base
# node:24-slim ships with no libssl — without it, Prisma's query engine
# can't detect which OpenSSL version to link against and silently
# defaults to a guess (openssl-1.1.x) that may not match what's actually
# available. Only the deps/builder stages need this (prisma generate,
# migrate) — the runner stage doesn't inherit from base and has no such
# dependency at runtime.
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app

################################################################################
# deps — install all dependencies (including devDependencies — next build
# type-checks and lints by default, and typescript/eslint are devDependencies).
#
# SKIP_ENV_VALIDATION=1 tells src/lib/env.ts to skip its Zod validation.
# prisma.config.ts imports that module, so even `prisma generate` (run by
# postinstall) would otherwise need real-looking DATABASE_URL/JWT_SECRET
# values just to satisfy the schema, despite never actually using them.
# Real secrets are injected at container runtime via the homelab-docker-compose
# repo's env_file — this flag is never set there, so validation still runs
# for real wherever it actually matters.
################################################################################
FROM base AS deps

ENV SKIP_ENV_VALIDATION=1 \
    NODE_ENV=development

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY src/lib/env.ts ./src/lib/env.ts

RUN pnpm install --frozen-lockfile

################################################################################
# builder — bring in the full source tree and run the Next.js build.
################################################################################
FROM base AS builder

ENV SKIP_ENV_VALIDATION=1 \
    NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# .dockerignore excludes src/generated from the build context, so the
# Prisma client generated in the deps stage never lands here via `COPY . .`
# — regenerate it against the full schema (cheap, idempotent).
RUN pnpm exec prisma generate
RUN pnpm build

################################################################################
# runner — minimal production image: standalone server output, static
# assets, public/. No node_modules, no source, no build tooling.
# Migrations are NOT run here — `prisma migrate deploy` is a separate,
# out-of-band step.
################################################################################
FROM node:24-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
