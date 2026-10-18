import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { PageTitle } from '@/components';
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

  // With no decks yet, the form's + Add deck creates the first one
  return (
    <>
      <PageTitle title={t('title')} />
      <EventForm mode="create" username={username} decks={decks} />
    </>
  );
};

export default CreateEventPage;
