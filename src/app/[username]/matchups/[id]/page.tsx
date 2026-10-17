import type { ReactNode } from 'react';
import Link from 'next/link';
import { getFormatter, getTranslations } from 'next-intl/server';
import { getFormatsForOwner, getFormatWithMatchStatistics } from '@/lib/dal';
import { cn, getWinRateTint } from '@/lib/utils';
import {
  Button,
  DeckFilter,
  FormatFilter,
  PageTitle,
  SectionHeader,
  Tooltip,
} from '@/components';
import FormatButtons from './FormatButtons';
import classes from './formatPage.module.css';

const renderNumber = (chunks: ReactNode) => (
  <strong className="text-number">{chunks}</strong>
);

const FormatPage = async ({
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

  const t = await getTranslations('formatPage');
  const tCommon = await getTranslations('common');
  const tMatchups = await getTranslations('matchups');
  const formatter = await getFormatter();

  const [
    { format, isOwner, selectedDeck, matchStatistics, totals },
    { formats },
  ] = await Promise.all([
    getFormatWithMatchStatistics({
      ownerUsername: username,
      formatId: id,
      deckSlug: typeof deck === 'string' ? deck : undefined,
    }),
    getFormatsForOwner({ ownerUsername: username }),
  ]);

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
              <Link
                href={`/${username}/decks/create?format=${encodeURIComponent(format.id)}`}
              >
                <Button variant="secondary">{t('addDeck')}</Button>
              </Link>
              {selectedDeck && (
                <Link href={`/${username}/decks/${selectedDeck.slug}/edit`}>
                  <Button variant="secondary">{t('editDeck')}</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <section className={classes.section}>
        <SectionHeader>{t('opponentArchetypesSection')}</SectionHeader>
        {matchStatistics.length === 0 ? (
          <p>{selectedDeck ? t('noDeckMatches') : t('noOpponentArchetypes')}</p>
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
              <tbody>
                {matchStatistics.map(row => (
                  <tr key={row.opponentArchetypeId}>
                    <td>
                      {/* Keeps the deck filter on the archetype page */}
                      <Link
                        href={`/${username}/opponents/${row.opponentArchetypeId}${
                          selectedDeck
                            ? `?deck=${encodeURIComponent(selectedDeck.slug)}`
                            : ''
                        }`}
                      >
                        {row.opponentArchetype}
                      </Link>
                    </td>
                    <td className="text-number">{row.totalMatches}</td>
                    {row.totalMatches === 0 ? (
                      <>
                        <td className="text-number">{tCommon('noValue')}</td>
                        <td className="text-number">{tCommon('noValue')}</td>
                      </>
                    ) : (
                      <>
                        <td className="text-number">
                          {tCommon('matchRecord', {
                            wins: row.matchWins,
                            losses: row.matchLosses,
                            ties: row.matchDraws,
                          })}
                        </td>
                        <td
                          className={cn(
                            'text-number',
                            getWinRateTint({
                              winRate: row.matchWinRate,
                              matchCount: row.totalMatches,
                            }),
                          )}
                        >
                          {formatter.number(row.matchWinRate, {
                            style: 'percent',
                            maximumFractionDigits: 1,
                          })}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
};

export default FormatPage;
