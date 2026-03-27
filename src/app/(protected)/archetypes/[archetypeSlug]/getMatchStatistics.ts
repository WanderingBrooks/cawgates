import { prisma } from '@/lib/prisma';

const getMatchStatistics = async ({ archetypeId }: { archetypeId: string }) => {
  const matches = await prisma.match.findMany({
    where: {
      event: {
        archetypeId,
      },
    },
    select: {
      opponentArchetype: true,
      wins: true,
      losses: true,
    },
  });

  const archetypeStats = matches.reduce(
    (acc, match) => {
      const archetype = match.opponentArchetype;

      if (!acc[archetype]) {
        acc[archetype] = {
          matchWins: 0,
          matchLosses: 0,
          matchDraws: 0,
          gameWins: 0,
          gameLosses: 0,
          total: 0,
        };
      }

      acc[archetype].gameWins += match.wins;
      acc[archetype].gameLosses += match.losses;
      acc[archetype].total += match.wins + match.losses;

      if (match.wins > match.losses) {
        acc[archetype].matchWins += 1;
      } else if (match.losses > match.wins) {
        acc[archetype].matchLosses += 1;
      } else {
        acc[archetype].matchDraws += 1;
      }

      return acc;
    },
    {} as Record<
      string,
      {
        matchWins: number;
        matchLosses: number;
        matchDraws: number;
        gameWins: number;
        gameLosses: number;
        total: number;
      }
    >,
  );

  // Sort order:
  // 1) Total games played (wins + losses) descending — more data first.
  // 2) Alphabetical ascending fallback for deterministic ordering.
  const sortedArchetypes = Object.entries(archetypeStats).sort(
    ([aName, aStats], [bName, bStats]) => {
      if (bStats.total !== aStats.total) {
        return bStats.total - aStats.total;
      }

      return aName.localeCompare(bName);
    },
  );

  return sortedArchetypes.map(([archetype, stats]) => ({
    key: archetype,
    archetype,
    matchWins: stats.matchWins,
    matchLosses: stats.matchLosses,
    matchDraws: stats.matchDraws,
    gameWins: stats.gameWins,
    gameLosses: stats.gameLosses,
    total: stats.total,
  }));
};

export default getMatchStatistics;
