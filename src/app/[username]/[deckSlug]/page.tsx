import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { PageTitle, Button } from '@/components';
import { getDeck } from '@/lib/dal';
import getMatchStatistics from './getMatchStatistics';
import classes from './deck.module.css';

const DeckPage = async ({
  params,
}: {
  params: Promise<{ username: string; deckSlug: string }>;
}) => {
  const { username, deckSlug } = await params;
  const t = await getTranslations('deckPage');

  const { deck } = await getDeck({ ownerUsername: username, deckSlug });

  const matchStatistics = await getMatchStatistics({
    deckId: deck.id,
  });

  return (
    <>
      <PageTitle title={t('title')} subtitle={deck.name} />
      <div className={classes.rightAlignedButton}>
        <Link href={`/${username}/${deck.slug}/edit`}>
          <Button variant="primary">{t('editDeck')}</Button>
        </Link>
      </div>
      {matchStatistics.length === 0 ? (
        <p>{t('noMatches')}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>{t('opponentArchetype')}</th>
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
                    href={`/${username}/${deckSlug}/opponents/${row.opponentArchetypeId}`}
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

export default DeckPage;
