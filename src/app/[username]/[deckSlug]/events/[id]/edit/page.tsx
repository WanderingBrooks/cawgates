import { PageTitle } from '@/components';
import EventForm from '../../EventForm';
import { EventFormData } from '@/lib/types';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getEvent } from '@/lib/dal';

const EditEventPage = async ({
  params,
}: {
  params: Promise<{ username: string; deckSlug: string; id: string }>;
}) => {
  const { username, deckSlug, id } = await params;
  const t = await getTranslations('editEvent');

  const { deck, event, isOwner } = await getEvent({
    ownerUsername: username,
    deckSlug,
    eventId: id,
  });

  if (!isOwner) {
    notFound();
  }

  const initialEventData: EventFormData = {
    eventName: event.name || '',
    eventDate: event.date.toISOString().split('T')[0],
    notes: event.notes || '',
  };

  return (
    <>
      <PageTitle title={t('title')} subtitle={deck.name} />
      <EventForm
        mode="edit"
        username={username}
        deckId={deck.id}
        deckSlug={deck.slug}
        eventId={id}
        initialEventData={initialEventData}
      />
    </>
  );
};

export default EditEventPage;
