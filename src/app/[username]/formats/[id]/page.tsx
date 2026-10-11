import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getFormat } from '@/lib/dal';
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
  const tArchetype = await getTranslations('formatOpponentArchetype');

  const { format } = await getFormat({
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

  return (
    <>
      <PageTitle
        title={format.name}
        actions={
          <>
            <EditFormatButton formatId={format.id} initialName={format.name} />
            <div className={cn(classes.titleDelete, classes.desktopOnly)}>
              {deleteFormatButton}
            </div>
          </>
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
                      <th className="text-number">{t('matches')}</th>
                      <th>
                        <span className="visually-hidden">{t('actions')}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {format.opponentArchetypes.map(opponentArchetype => (
                      <OpponentArchetypeRow
                        key={opponentArchetype.id}
                        opponentArchetypeId={opponentArchetype.id}
                        name={opponentArchetype.name}
                        matchCount={opponentArchetype._count.matches}
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
      </section>
    </>
  );
};

export default FormatPage;
