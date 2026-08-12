# syntax=docker/dockerfile:1

################################################################################
# base — shared by all stages.
################################################################################
FROM node:24-slim AS base
RUN corepack enable && corepack prepare pnpm@10 --activate
WORKDIR /app

################################################################################
# deps — install all dependencies (including devDependencies — next build
# type-checks and lints by default, and typescript/eslint are devDependencies).
#
# DATABASE_URL / JWT_SECRET are BUILD-TIME PLACEHOLDERS ONLY. prisma.config.ts
# imports src/lib/env.ts, which eagerly Zod-validates env vars at import time,
# so even `prisma generate` (run by postinstall) needs *some* value present.
# Real secrets are injected at container runtime via the homelab-docker-compose
# repo's env_file — they never appear in the final runtime image.
################################################################################
FROM base AS deps

ARG DATABASE_URL="postgresql://user:password@localhost:5432/db"
ARG JWT_SECRET="build-time-placeholder-secret-min-32-characters"
ENV DATABASE_URL=${DATABASE_URL} \
    JWT_SECRET=${JWT_SECRET} \
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

ARG DATABASE_URL="postgresql://user:password@localhost:5432/db"
ARG JWT_SECRET="build-time-placeholder-secret-min-32-characters"
ENV DATABASE_URL=${DATABASE_URL} \
    JWT_SECRET=${JWT_SECRET} \
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
