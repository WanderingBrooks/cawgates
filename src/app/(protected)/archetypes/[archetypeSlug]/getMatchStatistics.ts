import { prisma } from '@/lib/prisma';

const getMatchStatistics = async ({ archetypeId }: { archetypeId: string }) => {
  const matches = await prisma.match.findMany({
    where: {
      event: {
        archetypeId,
      },
    },
    select: {
      opponentArchetype: {
        select: { name: true },
      },
      wins: true,
      losses: true,
    },
  });

  const archetypeStats = matches.reduce(
    (acc, match) => {
      const archetype = match.opponentArchetype.name;

      if (!acc[archetype]) {
        acc[archetype] = { wins: 0, losses: 0, winRate: 0, total: 0 };
      }

      acc[archetype].wins += match.wins;
      acc[archetype].losses += match.losses;
      acc[archetype].total += match.losses + match.wins;

      return acc;
    },
    {} as Record<
      string,
      { wins: number; losses: number; winRate: number; total: number }
    >,
  );

  // Compute winRate once per archetype.
  for (const stats of Object.values(archetypeStats)) {
    stats.winRate = stats.total === 0 ? 0 : stats.wins / stats.total;
  }

  // Sort order:
  // 1) Total games played (wins + losses) descending — more data first.
  // 2) Win rate descending for ties in total games (wins/total).
  // 3) Alphabetical ascending fallback for deterministic ordering.
  const sortedArchetypes = Object.entries(archetypeStats).sort(
    ([aName, aStats], [bName, bStats]) => {
      const aTotal = aStats.wins + aStats.losses;
      const bTotal = bStats.wins + bStats.losses;

      if (bTotal !== aTotal) {
        return bTotal - aTotal;
      }

      if (bStats.winRate !== aStats.winRate) {
        return bStats.winRate - aStats.winRate;
      }

      return aName.localeCompare(bName);
    },
  );

  return sortedArchetypes.map(([archetype, stats]) => ({
    key: archetype,
    archetype,
    wins: stats.wins,
    losses: stats.losses,
    winRate: stats.winRate,
    total: stats.total,
  }));
};

export default getMatchStatistics;
