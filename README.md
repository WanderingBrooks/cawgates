# Cawgates

A Magic: The Gathering match tracker. Track your tournament events, record match results against different archetypes, and analyze your performance with win rate statistics.

## Local Setup

### Prerequisites

- Node.js 24.13.1 (see `.nvmrc`)
- PostgreSQL database

### Installation

1. **Clone and install dependencies**

   ```bash
   git clone https://github.com/WanderingBrooks/cawgates.git
   cd cawgates
   npm install
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
   npx prisma migrate dev
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Production

The app is currently deployed at **[https://cawgates.제이슨.com](https://cawgates.제이슨.com)** and running on [Render.com](https://render.com).

## Future Improvements

1. Make a table for user_defined_archetypes. Make it possible to view / edit archetypes as a seperate entity
2. Make it possible to view all matches / events where you played against an archetype
3. Make it possible for a user to track events for different archetypes they play. That should be the first thing they chose when coming into the app. What archetype do they want to view / Add an event for?
