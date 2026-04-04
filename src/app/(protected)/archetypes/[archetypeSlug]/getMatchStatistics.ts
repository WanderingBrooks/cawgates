import { prisma } from '@/lib/prisma';

const getMatchStatistics = async ({ archetypeId }: { archetypeId: string }) => {
  const opponentArchetypes = await prisma.opponentArchetype.findMany({
    where: {
      archetypeId,
    },
    select: {
      id: true,
      name: true,
      matches: {
        select: { wins: true, losses: true },
      },
    },
  });

  const archetypeStats = opponentArchetypes.map(opponentArchetype => {
    const gameWins = opponentArchetype.matches.reduce(
      (sum, match) => sum + match.wins,
      0,
    );

    const gameLosses = opponentArchetype.matches.reduce(
      (sum, match) => sum + match.losses,
      0,
    );

    return {
      opponentArchetype: opponentArchetype.name,
      opponentArchetypeId: opponentArchetype.id,
      totalMatches: opponentArchetype.matches.length,
      totalGames: gameWins + gameLosses,
      gameWins,
      gameLosses,
      gameWinRate: 0, // Placeholder, will compute after loop
      matchWins: opponentArchetype.matches.reduce(
        (sum, match) => sum + (match.wins > match.losses ? 1 : 0),
        0,
      ),
      matchLosses: opponentArchetype.matches.reduce(
        (sum, match) => sum + (match.losses > match.wins ? 1 : 0),
        0,
      ),
      matchDraws: opponentArchetype.matches.reduce(
        (sum, match) => sum + (match.wins === match.losses ? 1 : 0),
        0,
      ),
    };
  });

  // Compute winRate once per archetype.
  for (const stats of archetypeStats) {
    stats.gameWinRate =
      stats.totalGames === 0 ? 0 : stats.gameWins / stats.totalGames;
  }

  // Sort order:
  // 1) Total games played (wins + losses) descending — more data first.
  // 2) Win rate descending for ties in total games (wins/total).
  // 3) Alphabetical ascending fallback for deterministic ordering.
  const sortedArchetypes = archetypeStats.sort((a, b) => {
    const aTotal = a.gameWins + a.gameLosses;
    const bTotal = b.gameWins + b.gameLosses;

    if (bTotal !== aTotal) {
      return bTotal - aTotal;
    }

    if (b.gameWinRate !== a.gameWinRate) {
      return b.gameWinRate - a.gameWinRate;
    }

    return a.opponentArchetype.localeCompare(b.opponentArchetype);
  });

  return sortedArchetypes.map(archetype => ({
    opponentArchetype: archetype.opponentArchetype,
    opponentArchetypeId: archetype.opponentArchetypeId,
    wins: archetype.gameWins,
    losses: archetype.gameLosses,
    winRate: archetype.gameWinRate,
    total: archetype.totalGames,
    matchWins: archetype.matchWins,
    matchLosses: archetype.matchLosses,
    matchDraws: archetype.matchDraws,
  }));
};

export default getMatchStatistics;
