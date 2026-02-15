import { prisma } from '@/lib/prisma';

const getMatchStatistics = async ({ userId }: { userId: string }) => {
  const matches = await prisma.match.findMany({
    where: {
      event: {
        userId: userId,
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
        acc[archetype] = { wins: 0, losses: 0 };
      }

      acc[archetype].wins += match.wins;
      acc[archetype].losses += match.losses;

      return acc;
    },
    {} as Record<string, { wins: number; losses: number }>,
  );

  const sortedArchetypes = Object.entries(archetypeStats).sort(
    ([, a], [, b]) => b.wins + b.losses - (a.wins + a.losses),
  );

  const matchStatistics = sortedArchetypes.map(([archetype, stats]) => ({
    key: archetype,
    archetype,
    wins: stats.wins,
    losses: stats.losses,
  }));

  return matchStatistics;
};

export default getMatchStatistics;
