import type { ReactNode } from 'react';
import Link from 'next/link';
import { getFormatter, getTranslations } from 'next-intl/server';
import { getFormatsForOwner, getFormatWithMatchStatistics } from '@/lib/dal';
import { cn } from '@/lib/utils';
import {
  Button,
  DeckFilter,
  FormatFilter,
  PageTitle,
  SectionHeader,
  Tooltip,
} from '@/components';
import DeleteFormatButton from './DeleteFormatButton';
import EditFormatButton from './EditFormatButton';
import OpponentArchetypeRow from './OpponentArchetypeRow';
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
  const tArchetype = await getTranslations('formatOpponentArchetype');
  const tDelete = await getTranslations('deleteFormatButton');
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

  const hasArchetypesWithMatches = format.opponentArchetypes.some(
    opponentArchetype => opponentArchetype._count.matches > 0,
  );

  const deleteFormatButton = (
    <DeleteFormatButton
      formatId={format.id}
      deckCount={format.decks.length}
      opponentArchetypeCount={format.opponentArchetypes.length}
    />
  );

  const hasDecks = format.decks.length > 0;

  return (
    <>
      <PageTitle
        title={format.name}
        subtitle={
          totals.totalMatches > 0 && [
            <span key="wins">
              {t.rich('totalMatchWins', {
                count: totals.matchWins,
                num: renderNumber,
              })}
            </span>,
            <span key="losses">
              {t.rich('totalMatchLosses', {
                count: totals.matchLosses,
                num: renderNumber,
              })}
            </span>,
            <span key="winRate">
              {t.rich('totalMatchWinPct', {
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
        actions={
          isOwner && (
            <div className={classes.titleActions}>
              <div className={classes.titleButtons}>
                <EditFormatButton
                  formatId={format.id}
                  initialName={format.name}
                />
                <div className={classes.desktopOnly}>{deleteFormatButton}</div>
              </div>
              {/* Kept outside the button row so its width doesn't push the buttons apart */}
              {hasDecks && (
                <p
                  className={cn('hint', classes.titleHint, classes.desktopOnly)}
                >
                  {tDelete('hasDecksHint')}
                </p>
              )}
            </div>
          )
        }
      />

      <div className={classes.filterRow}>
        {/* With one format its name is already in the menu and the title */}
        {formats.length > 1 && (
          <FormatFilter
            username={username}
            formats={formats}
            selectedFormatId={format.id}
          />
        )}
        <DeckFilter
          decks={format.decks}
          selectedDeckSlug={selectedDeck?.slug ?? null}
        />
        {isOwner && (
          <div className={classes.filterButtons}>
            {selectedDeck && (
              <Link href={`/${username}/decks/${selectedDeck.slug}/edit`}>
                <Button variant="secondary">{t('editDeck')}</Button>
              </Link>
            )}
            <Link href={`/${username}/decks/create`}>
              <Button variant="secondary">{t('createDeck')}</Button>
            </Link>
          </div>
        )}
      </div>

      <section className={classes.section}>
        <SectionHeader>{t('opponentArchetypesSection')}</SectionHeader>
        {matchStatistics.length === 0 ? (
          <p>{selectedDeck ? t('noDeckMatches') : t('noOpponentArchetypes')}</p>
        ) : (
          <>
            {isOwner && hasArchetypesWithMatches && (
              <p className="hint">{tArchetype('hasMatchesHint')}</p>
            )}
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>{t('archetype')}</th>
                    <th className="text-number">
                      {tCommon('matchRecordLabel')}
                    </th>
                    <th className="text-number">
                      {tCommon('gameRecordLabel')}
                    </th>
                    <th className="text-number">
                      {tCommon('gameWinPctLabel')}
                    </th>
                    {isOwner && <th />}
                  </tr>
                </thead>
                <tbody>
                  {matchStatistics.map(row => (
                    <OpponentArchetypeRow
                      key={row.opponentArchetypeId}
                      row={row}
                      username={username}
                      isOwner={isOwner}
                      deckSlug={selectedDeck?.slug ?? null}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* On phones the delete button moves from the title down here */}
      {isOwner && (
        <section className={cn(classes.section, classes.mobileOnly)}>
          <SectionHeader>{t('dangerZone')}</SectionHeader>
          {deleteFormatButton}
          {hasDecks && <p className="hint">{tDelete('hasDecksHint')}</p>}
        </section>
      )}
    </>
  );
};

export default FormatPage;
