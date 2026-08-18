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

The app is self-hosted, deployed at **[cawgates.ajasonb.xyz](https://cawgates.ajasonb.xyz)**.

Deployment and database migrations are automated via GitHub Actions on every push to `trunk`. Migrations are written to be backwards compatible with the currently-running deployment, since the previous version keeps serving requests until the new one is up.
