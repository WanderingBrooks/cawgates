import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getDecksForOwner } from '@/lib/dal';
import { Button, Card, CardTitle, PageTitle } from '@/components';
import classes from './decks.module.css';

const DecksPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const t = await getTranslations('decks');

  const { decks, isOwner } = await getDecksForOwner({ ownerUsername: username });

  return (
    <>
      <PageTitle title={isOwner ? t('title') : t('guestTitle', { username })} />
      {isOwner && (
        <div className={classes.rightAlignedButton}>
          <Link href={`/${username}/create`}>
            <Button variant="primary">{t('createDeck')}</Button>
          </Link>
        </div>
      )}

      {decks.length === 0 ? (
        <p>{t('noDecks')}</p>
      ) : (
        decks.map(deck => (
          <Card key={deck.id}>
            <CardTitle>
              <Link href={`/${username}/${deck.slug}`}>
                {deck.name}
              </Link>
              <span>{t('eventCount', { count: deck._count.events })}</span>
            </CardTitle>
          </Card>
        ))
      )}
    </>
  );
};

export default DecksPage;
