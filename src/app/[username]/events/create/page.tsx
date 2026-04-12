import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button, PageTitle } from '@/components';
import { getDecksForOwner } from '@/lib/dal';
import EventForm from '../EventForm';

const CreateEventPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const t = await getTranslations('createEvent');
  const { username } = await params;

  const { decks, isOwner } = await getDecksForOwner({
    ownerUsername: username,
  });

  if (!isOwner) {
    notFound();
  }

  // If the user doesn't have any decks yet they cannot create an event
  // Render info text and a button redirecting them to create a deck first.
  if (decks.length === 0) {
    return (
      <>
        <PageTitle title={t('title')} />
        <p>{t('noDecksHint')}</p>
        <Link href={`/${username}/decks/create`}>
          <Button variant="primary">{t('createDeck')}</Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <PageTitle title={t('title')} />
      <EventForm mode="create" username={username} decks={decks} />
    </>
  );
};

export default CreateEventPage;
