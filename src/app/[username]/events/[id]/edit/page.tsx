import { PageTitle } from '@/components';
import EventForm from '../../EventForm';
import { EventFormData } from '@/lib/types';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getEvent } from '@/lib/dal';

const EditEventPage = async ({
  params,
}: {
  params: Promise<{ username: string; id: string }>;
}) => {
  const { username, id } = await params;
  const t = await getTranslations('editEvent');

  const { event, isOwner } = await getEvent({
    eventId: id,
    ownerUsername: username,
  });

  if (!isOwner) {
    notFound();
  }

  const initialEventData: EventFormData = {
    deckId: event.deck.id,
    eventName: event.name || '',
    eventDate: event.date.toISOString().split('T')[0],
    notes: event.notes || '',
  };

  return (
    <>
      <PageTitle title={t('title')} subtitle={event.deck.name} />
      <EventForm
        mode="edit"
        eventId={id}
        username={username}
        initialEventData={initialEventData}
      />
    </>
  );
};

export default EditEventPage;
