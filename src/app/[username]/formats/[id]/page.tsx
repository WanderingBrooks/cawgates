import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getFormatWithMatchStatistics } from '@/lib/dal';
import { cn } from '@/lib/utils';
import { PageTitle, SectionHeader } from '@/components';
import DeleteFormatButton from './DeleteFormatButton';
import EditFormatButton from './EditFormatButton';
import OpponentArchetypeRow from './OpponentArchetypeRow';
import classes from './formatPage.module.css';

const FormatPage = async ({
  params,
}: {
  params: Promise<{ username: string; id: string }>;
}) => {
  const { username, id } = await params;
  const t = await getTranslations('formatPage');
  const tCommon = await getTranslations('common');
  const tArchetype = await getTranslations('formatOpponentArchetype');
  const tDelete = await getTranslations('deleteFormatButton');

  const { format, matchStatistics } = await getFormatWithMatchStatistics({
    ownerUsername: username,
    formatId: id,
  });

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
        actions={
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
              <p className={cn('hint', classes.titleHint, classes.desktopOnly)}>
                {tDelete('hasDecksHint')}
              </p>
            )}
          </div>
        }
      />

      <div className={classes.columns}>
        <section className={cn(classes.section, classes.decksColumn)}>
          <SectionHeader>{t('decksSection')}</SectionHeader>
          {format.decks.length === 0 ? (
            <p>{t('noDecks')}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>{t('deck')}</th>
                </tr>
              </thead>
              <tbody>
                {format.decks.map(deck => (
                  <tr key={deck.id}>
                    <td>
                      <Link href={`/${username}/${deck.slug}`}>
                        {deck.name}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className={cn(classes.section, classes.archetypesColumn)}>
          <SectionHeader>{t('opponentArchetypesSection')}</SectionHeader>
          {format.opponentArchetypes.length === 0 ? (
            <p>{t('noOpponentArchetypes')}</p>
          ) : (
            <>
              {hasArchetypesWithMatches && (
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
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {matchStatistics.map(row => (
                      <OpponentArchetypeRow
                        key={row.opponentArchetypeId}
                        row={row}
                        username={username}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </div>

      {/* On phones the delete button moves from the title down here */}
      <section className={cn(classes.section, classes.mobileOnly)}>
        <SectionHeader>{t('dangerZone')}</SectionHeader>
        {deleteFormatButton}
        {hasDecks && <p className="hint">{tDelete('hasDecksHint')}</p>}
      </section>
    </>
  );
};

export default FormatPage;
