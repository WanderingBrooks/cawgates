import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { PageTitle } from '@/components';
import { getDeck } from '@/lib/dal';
import EventForm from '../EventForm';

const CreateEventPage = async ({
  params,
}: {
  params: Promise<{ username: string; deckSlug: string }>;
}) => {
  const t = await getTranslations('createEvent');
  const { username, deckSlug } = await params;

  const { deck, isOwner } = await getDeck({ ownerUsername: username, deckSlug });

  if (!isOwner) {
    notFound();
  }

  return (
    <>
      <PageTitle title={t('title')} subtitle={deck.name} />
      <EventForm
        mode="create"
        username={username}
        deckId={deck.id}
        deckSlug={deck.slug}
      />
    </>
  );
};

export default CreateEventPage;
