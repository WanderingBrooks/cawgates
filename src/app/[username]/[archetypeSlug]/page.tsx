import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { PageTitle, Button } from '@/components';
import { getArchetype } from '@/lib/dal';
import getMatchStatistics from './getMatchStatistics';
import classes from './archetype.module.css';

const ArchetypePage = async ({
  params,
}: {
  params: Promise<{ username: string; archetypeSlug: string }>;
}) => {
  const { username, archetypeSlug } = await params;
  const t = await getTranslations('archetypePage');

  const { archetype, isOwner } = await getArchetype({ ownerUsername: username, archetypeSlug });

  const matchStatistics = await getMatchStatistics({
    archetypeId: archetype.id,
  });

  return (
    <>
      <PageTitle title={t('title')} subtitle={archetype.name} />
      {isOwner && (
        <div className={classes.rightAlignedButton}>
          <Link href={`/${username}/${archetypeSlug}/edit`}>
            <Button variant="primary">{t('edit')}</Button>
          </Link>
        </div>
      )}
      {matchStatistics.length === 0 ? (
        <p>{t('noMatches')}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>{t('archetype')}</th>
              <th>{t('matchRecord')}</th>
              <th>{t('gameRecord')}</th>
              <th>{t('gameWinPct')}</th>
            </tr>
          </thead>
          <tbody>
            {matchStatistics.map(row => (
              <tr key={row.opponentArchetypeId}>
                <td>
                  <Link
                    href={`/${username}/${archetypeSlug}/opponents/${row.opponentArchetypeId}`}
                  >
                    {row.opponentArchetype}
                  </Link>
                </td>
                <td>{`${row.matchWins}-${row.matchLosses}-${row.matchDraws}`}</td>
                <td>{`${row.wins}-${row.losses}`}</td>
                <td>{`${(row.winRate * 100).toFixed(1)}%`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default ArchetypePage;
