import Link from 'next/link';
import { getTranslations, getFormatter } from 'next-intl/server';
import { PageTitle, Button, Card, CardContent, Tooltip } from '@/components';
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
  const formatter = await getFormatter();

  const { deck, isOwner } = await getDeck({
    ownerUsername: username,
    deckSlug,
  });

  const { rows: matchStatistics, totals } = await getMatchStatistics({
    deckId: deck.id,
  });

  return (
    <>
      <PageTitle title={t('title')} subtitle={deck.name} />
      {isOwner && (
        <div className={classes.rightAlignedButton}>
          <Link href={`/${username}/${deck.slug}/edit`}>
            <Button variant="primary">{t('editDeck')}</Button>
          </Link>
        </div>
      )}
      {totals.totalMatches > 0 && (
        <Card className={classes.summaryCard}>
          <CardContent direction="horizontal" className={classes.summaryRow}>
            <div className={classes.summaryStat}>
              <p className="text-label">{t('totalMatchWins')}</p>
              <p className="text-emphasis">{totals.matchWins}</p>
            </div>
            <div className={classes.summaryStat}>
              <p className="text-label">{t('totalMatchLosses')}</p>
              <p className="text-emphasis">{totals.matchLosses}</p>
            </div>
            <div className={classes.summaryStat}>
              <p className="text-label">
                <Tooltip content={t('matchWinPctExplainer')}>
                  {t('matchWinPct')}
                </Tooltip>
              </p>
              <p className="text-emphasis">
                {formatter.number(totals.matchWinRate, {
                  style: 'percent',
                  maximumFractionDigits: 1,
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      {matchStatistics.length === 0 ? (
        <>
          {isOwner ? (
            <>
              <p>{t('noMatchesOwner')}</p>
              <Link href={`/${username}/events/create`}>
                <Button variant="primary">{t('createEvent')}</Button>
              </Link>
            </>
          ) : (
            <p>{t('noMatchesViewer')}</p>
          )}
        </>
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
                <td>
                  {formatter.number(row.winRate, {
                    style: 'percent',
                    maximumFractionDigits: 1,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default DeckPage;
