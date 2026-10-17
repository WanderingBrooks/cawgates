import Link from 'next/link';
import { getTranslations, getFormatter } from 'next-intl/server';
import { PageTitle, Button, Tooltip } from '@/components';
import { getDeck } from '@/lib/dal';
import { cn, getWinRateTint } from '@/lib/utils';
import getMatchStatistics from '@/lib/getMatchStatistics';

const DeckPage = async ({
  params,
}: {
  params: Promise<{ username: string; deckSlug: string }>;
}) => {
  const { username, deckSlug } = await params;
  const t = await getTranslations('deckPage');
  const tCommon = await getTranslations('common');
  const formatter = await getFormatter();

  const { deck, isOwner } = await getDeck({
    ownerUsername: username,
    deckSlug,
  });

  const { rows: matchStatistics, totals } = await getMatchStatistics({
    deckId: deck.id,
    formatId: deck.formatId,
  });

  return (
    <>
      <PageTitle
        title={deck.name}
        subtitle={
          <>
            <span>{deck.format.name}</span>
            {totals.totalMatches > 0 && (
              <>
                <span>
                  {t('totalMatchWins')}{' '}
                  <strong className="text-number">{totals.matchWins}</strong>
                </span>
                <span>
                  {t('totalMatchLosses')}{' '}
                  <strong className="text-number">{totals.matchLosses}</strong>
                </span>
                <span>
                  <Tooltip content={t('matchWinPctExplainer')}>
                    {t('matchWinPct')}
                  </Tooltip>{' '}
                  <strong className="text-number">
                    {formatter.number(totals.matchWinRate, {
                      style: 'percent',
                      maximumFractionDigits: 1,
                    })}
                  </strong>
                </span>
              </>
            )}
          </>
        }
        actions={
          isOwner && (
            <Link href={`/${username}/${deck.slug}/edit`}>
              <Button variant="secondary">{t('editDeck')}</Button>
            </Link>
          )
        }
      />
      {matchStatistics.length === 0 ? (
        <>
          {isOwner ? (
            <>
              <p>{t('noMatchesOwner')}</p>
              <div>
                <Link href={`/${username}/events/create`}>
                  <Button variant="primary">{t('createEvent')}</Button>
                </Link>
              </div>
            </>
          ) : (
            <p>{t('noMatchesViewer')}</p>
          )}
        </>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>{t('opponentArchetype')}</th>
                <th className="text-number">{t('matchRecord')}</th>
                <th className="text-number">{t('gameRecord')}</th>
                <th className="text-number">{t('gameWinPct')}</th>
              </tr>
            </thead>
            <tbody>
              {matchStatistics.map(row => (
                <tr key={row.opponentArchetypeId}>
                  <td>
                    <Link
                      href={`/${username}/opponents/${row.opponentArchetypeId}`}
                    >
                      {row.opponentArchetype}
                    </Link>
                  </td>
                  <td className="text-number">
                    {tCommon('matchRecord', {
                      wins: row.matchWins,
                      losses: row.matchLosses,
                      ties: row.matchDraws,
                    })}
                  </td>
                  <td className="text-number">
                    {tCommon('gameRecord', {
                      wins: row.wins,
                      losses: row.losses,
                    })}
                  </td>
                  <td
                    className={cn(
                      'text-number',
                      getWinRateTint({
                        winRate: row.winRate,
                        matchCount: row.totalMatches,
                      }),
                    )}
                  >
                    {formatter.number(row.winRate, {
                      style: 'percent',
                      maximumFractionDigits: 1,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default DeckPage;
