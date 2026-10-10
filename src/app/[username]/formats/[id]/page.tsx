import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getFormat } from '@/lib/dal';
import { Card, CardTitle, PageTitle, SectionHeader } from '@/components';
import DeleteFormatButton from './DeleteFormatButton';
import FormatSubHeader from './FormatSubHeader';
import OpponentArchetypeRow from './OpponentArchetypeRow';
import classes from './formatPage.module.css';

const FormatPage = async ({
  params,
}: {
  params: Promise<{ username: string; id: string }>;
}) => {
  const { username, id } = await params;
  const t = await getTranslations('formatPage');

  const { format } = await getFormat({
    ownerUsername: username,
    formatId: id,
  });

  return (
    <>
      <PageTitle title={format.name} />
      <FormatSubHeader formatId={format.id} initialName={format.name} />

      <SectionHeader>{t('decksSection')}</SectionHeader>
      {format.decks.length === 0 ? (
        <p>{t('noDecks')}</p>
      ) : (
        <div className={classes.list}>
          {format.decks.map(deck => (
            <Card key={deck.id}>
              <CardTitle>
                <Link href={`/${username}/${deck.slug}`}>{deck.name}</Link>
              </CardTitle>
            </Card>
          ))}
        </div>
      )}

      <SectionHeader>{t('opponentArchetypesSection')}</SectionHeader>
      {format.opponentArchetypes.length === 0 ? (
        <p>{t('noOpponentArchetypes')}</p>
      ) : (
        <div className={classes.list}>
          {format.opponentArchetypes.map(opponentArchetype => (
            <OpponentArchetypeRow
              key={opponentArchetype.id}
              opponentArchetypeId={opponentArchetype.id}
              name={opponentArchetype.name}
              matchCount={opponentArchetype._count.matches}
            />
          ))}
        </div>
      )}

      <SectionHeader>{t('dangerZone')}</SectionHeader>
      <DeleteFormatButton
        formatId={format.id}
        deckCount={format.decks.length}
        opponentArchetypeCount={format.opponentArchetypes.length}
      />
    </>
  );
};

export default FormatPage;
