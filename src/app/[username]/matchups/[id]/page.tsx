import type { ReactNode } from 'react';
import Link from 'next/link';
import { getFormatter, getTranslations } from 'next-intl/server';
import { getFormatsForOwner, getFormatWithMatchStatistics } from '@/lib/dal';
import { cn, getWinRateTint } from '@/lib/utils';
import {
  CreateDeckButton,
  DeckFilter,
  EditDeckButton,
  FormatFilter,
  PageTitle,
  SectionHeader,
  Tooltip,
} from '@/components';
import FormatButtons from './FormatButtons';
import RogueRows from './RogueRows';
import classes from './matchupsPage.module.css';

const renderNumber = (chunks: ReactNode) => (
  <strong className="text-number">{chunks}</strong>
);

const MatchupsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ username: string; id: string }>;
  searchParams: Promise<{ deck?: string | string[] }>;
}) => {
  const [{ username, id }, { deck }] = await Promise.all([
    params,
    searchParams,
  ]);

  const t = await getTranslations('matchupsPage');
  const tCommon = await getTranslations('common');
  const tMatchups = await getTranslations('matchups');
  const formatter = await getFormatter();

  const [
    { format, isOwner, selectedDeck, matchStatistics, rogue, totals },
    { formats },
  ] = await Promise.all([
    getFormatWithMatchStatistics({
      ownerUsername: username,
      formatId: id,
      deckSlug: typeof deck === 'string' ? deck : undefined,
    }),
    getFormatsForOwner({ ownerUsername: username }),
  ]);

  const renderStatCells = ({ stats }: { stats: (typeof rogue)['totals'] }) => (
    <>
      <td className="text-number">{stats.totalMatches}</td>
      {stats.totalMatches === 0 ? (
        <>
          <td className="text-number">{tCommon('noValue')}</td>
          <td className="text-number">{tCommon('noValue')}</td>
        </>
      ) : (
        <>
          <td className="text-number">
            {tCommon('matchRecord', {
              wins: stats.matchWins,
              losses: stats.matchLosses,
              ties: stats.matchDraws,
            })}
          </td>
          <td
            className={cn(
              'text-number',
              getWinRateTint({
                winRate: stats.matchWinRate,
                matchCount: stats.totalMatches,
              }),
            )}
          >
            {formatter.number(stats.matchWinRate, {
              style: 'percent',
              maximumFractionDigits: 1,
            })}
          </td>
        </>
      )}
    </>
  );

  const renderRow = ({ row }: { row: (typeof matchStatistics)[number] }) => (
    <tr
      key={row.opponentArchetypeId}
      className={cn(row.isRogue && classes.rogueRow)}
    >
      <td>
        {/* Keeps the deck filter on the archetype page */}
        <Link
          href={`/${username}/opponents/${row.opponentArchetypeId}${
            selectedDeck ? `?deck=${encodeURIComponent(selectedDeck.slug)}` : ''
          }`}
        >
          {row.opponentArchetype}
        </Link>
      </td>
      {renderStatCells({ stats: row })}
    </tr>
  );

  return (
    <>
      <PageTitle
        title={tMatchups('title')}
        subtitle={
          totals.totalMatches > 0 && [
            <strong key="record" className="text-number">
              {tCommon('matchRecord', {
                wins: totals.matchWins,
                losses: totals.matchLosses,
                ties: totals.matchDraws,
              })}
            </strong>,
            <span key="winRate">
              {tCommon.rich('matchWinPct', {
                rate: formatter.number(totals.matchWinRate, {
                  style: 'percent',
                  maximumFractionDigits: 1,
                }),
                num: renderNumber,
                explainer: chunks => (
                  <Tooltip content={tCommon('matchWinPctExplainer')}>
                    {chunks}
                  </Tooltip>
                ),
              })}
            </span>,
          ]
        }
      />

      <div className={classes.filterRow}>
        {/* Always shown, even with one format, since the title doesn't name it */}
        <div className={classes.filterGroup}>
          <FormatFilter
            username={username}
            formats={formats}
            selectedFormatId={format.id}
          />
          {isOwner && (
            <FormatButtons
              username={username}
              formatId={format.id}
              formatName={format.name}
              deckCount={format.decks.length}
              opponentArchetypeCount={format.opponentArchetypes.length}
            />
          )}
        </div>
        <div className={classes.filterGroup}>
          <DeckFilter
            decks={format.decks}
            selectedDeckSlug={selectedDeck?.slug ?? null}
          />
          {isOwner && (
            <div className={classes.filterButtons}>
              <CreateDeckButton
                username={username}
                label={t('addDeck')}
                initialFormatId={format.id}
              />
              {selectedDeck && (
                <EditDeckButton
                  username={username}
                  label={t('editDeck')}
                  deck={{
                    id: selectedDeck.id,
                    name: selectedDeck.name,
                    slug: selectedDeck.slug,
                    formatId: selectedDeck.formatId,
                  }}
                  // The totals only count this deck's matches here
                  isFormatLocked={totals.totalMatches > 0}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <section className={classes.section}>
        <SectionHeader>{t('opponentArchetypesSection')}</SectionHeader>
        {matchStatistics.length === 0 && rogue.rows.length === 0 ? (
          <p>
            {isOwner
              ? t(selectedDeck ? 'noDeckMatches' : 'noOpponentArchetypes')
              : t(
                  selectedDeck
                    ? 'noDeckMatchesGuest'
                    : 'noOpponentArchetypesGuest',
                )}
          </p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>{t('archetype')}</th>
                  <th className="text-number">{tCommon('matchesLabel')}</th>
                  <th className="text-number">{tCommon('recordLabel')}</th>
                  <th className="text-number">{tCommon('winPctLabel')}</th>
                </tr>
              </thead>
              <tbody>{matchStatistics.map(row => renderRow({ row }))}</tbody>
              {rogue.rows.length > 0 && (
                <RogueRows
                  count={rogue.rows.length}
                  statCells={renderStatCells({ stats: rogue.totals })}
                >
                  {rogue.rows.map(row => renderRow({ row }))}
                </RogueRows>
              )}
            </table>
          </div>
        )}
      </section>
    </>
  );
};

export default MatchupsPage;
