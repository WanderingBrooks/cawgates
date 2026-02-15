import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { Page, Button, MatchTable, PageTitle } from '@/components';

const HomePage = async () => {
  const t = await getTranslations('home');

  const matches = await prisma.match.findMany({
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

  const tableRows = sortedArchetypes.map(([archetype, stats]) => ({
    key: archetype,
    archetype,
    wins: stats.wins,
    losses: stats.losses,
  }));

  return (
    <Page>
      <PageTitle>
        <h1>{t('title')}</h1>
        <Link href="/events">
          <Button>{t('viewEvents')}</Button>
        </Link>
      </PageTitle>

      <MatchTable rows={tableRows} showWinRate />
    </Page>
  );
};

export default HomePage;
