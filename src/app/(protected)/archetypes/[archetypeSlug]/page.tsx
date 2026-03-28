import { getTranslations } from 'next-intl/server';
import { PageTitle } from '@/components';
import { getArchetypeForUser } from '@/lib/dal';
import getMatchStatistics from './getMatchStatistics';

const ArchetypePage = async ({
  params,
}: {
  params: Promise<{ archetypeSlug: string }>;
}) => {
  const { archetypeSlug } = await params;
  const t = await getTranslations('archetypePage');

  const { archetype } = await getArchetypeForUser({ archetypeSlug });

  const matchStatistics = await getMatchStatistics({
    archetypeId: archetype.id,
  });

  return (
    <>
      <PageTitle title={t('title')} subtitle={archetype.name} />
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
              <tr key={row.key}>
                <td>{row.archetype}</td>
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
