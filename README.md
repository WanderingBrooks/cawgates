# Cawgates

A Magic: The Gathering match tracker. Track your tournament events, record match results against different archetypes, and analyze your performance with win rate statistics.

## Local Setup

### Prerequisites

- Node.js 24.13.1 (see `.nvmrc`)
- pnpm 10+ (`npm install -g pnpm`)
- PostgreSQL database

### Installation

1. **Clone and install dependencies**

   ```bash
   git clone https://github.com/WanderingBrooks/cawgates.git
   cd cawgates
   pnpm install
   ```

2. **Configure environment variables**

   Create a `.env` file:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/cawgates?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
   NODE_ENV=development
   ```

3. **Run database migrations**

   ```bash
   pnpm exec prisma migrate dev
   ```

4. **Start development server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Production

The app is currently deployed at **[cawgates.ajasonb.xyz](https://cawgates.ajasonb.xyz)** and running on [Vercel](https://vercel.com) with a [Supabase](https://supabase.com) postgres instance.

Migrations are run through a github action which is run before the deployment to Vercel. Migrations are thus written
to be backwards compatible to the previous deployment.
