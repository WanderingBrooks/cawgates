import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import Page from '@/components/page/page';
import Button from '@/components/button';
import classes from './app.module.css';

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

  return (
    <Page>
      <div className={classes.pageTitle}>
        <h1>{t('title')}</h1>
        <Link href="/events">
          <Button>{t('viewEvents')}</Button>
        </Link>
      </div>

      {sortedArchetypes.length === 0 ? (
        <p>{t('noMatches')}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>{t('archetype')}</th>
              <th>{t('wins')}</th>
              <th>{t('losses')}</th>
              <th>{t('winRate')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedArchetypes.map(([archetype, stats]) => {
              const total = stats.wins + stats.losses;

              const winRate =
                total > 0 ? ((stats.wins / total) * 100).toFixed(1) : '0.0';

              return (
                <tr key={archetype}>
                  <td>{archetype}</td>
                  <td>{stats.wins}</td>
                  <td>{stats.losses}</td>
                  <td>{winRate}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </Page>
  );
};

export default HomePage;
