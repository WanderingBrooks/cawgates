import { prisma } from '@/lib/prisma';

const getMatchStatistics = async ({ deckId }: { deckId: string }) => {
  const opponentArchetypes = await prisma.opponentArchetype.findMany({
    where: {
      deckId,
    },
    select: {
      id: true,
      name: true,
      matches: {
        select: { wins: true, losses: true },
      },
    },
  });

  const deckStats = opponentArchetypes.map(opponentArchetype => {
    const { wins, losses, matchWins, matchLosses, matchDraws } =
      opponentArchetype.matches.reduce<{
        wins: number;
        losses: number;
        matchWins: number;
        matchLosses: number;
        matchDraws: number;
      }>(
        (acc, match) => ({
          wins: acc.wins + match.wins,
          losses: acc.losses + match.losses,
          matchWins: acc.matchWins + (match.wins > match.losses ? 1 : 0),
          matchLosses: acc.matchLosses + (match.losses > match.wins ? 1 : 0),
          matchDraws: acc.matchDraws + (match.wins === match.losses ? 1 : 0),
        }),
        { wins: 0, losses: 0, matchWins: 0, matchLosses: 0, matchDraws: 0 },
      );

    const total = wins + losses;

    return {
      opponentArchetype: opponentArchetype.name,
      opponentArchetypeId: opponentArchetype.id,
      totalMatches: opponentArchetype.matches.length,
      total,
      wins,
      losses,
      winRate: total === 0 ? 0 : wins / total,
      matchWins,
      matchLosses,
      matchDraws,
    };
  });

  // Sort order:
  // 1) Total games played (wins + losses) descending — more data first.
  // 2) Win rate descending for ties in total games (wins/total).
  // 3) Alphabetical ascending fallback for deterministic ordering.
  const rows = deckStats.sort((a, b) => {
    if (b.total !== a.total) {
      return b.total - a.total;
    }

    if (b.winRate !== a.winRate) {
      return b.winRate - a.winRate;
    }

    return a.opponentArchetype.localeCompare(b.opponentArchetype);
  });

  const totals = rows.reduce(
    (acc, row) => ({
      matchWins: acc.matchWins + row.matchWins,
      matchLosses: acc.matchLosses + row.matchLosses,
      matchDraws: acc.matchDraws + row.matchDraws,
    }),
    { matchWins: 0, matchLosses: 0, matchDraws: 0 },
  );

  const totalMatches =
    totals.matchWins + totals.matchLosses + totals.matchDraws;

  return {
    rows,
    totals: {
      ...totals,
      totalMatches,
      matchWinRate: totalMatches === 0 ? 0 : totals.matchWins / totalMatches,
    },
  };
};

export default getMatchStatistics;
