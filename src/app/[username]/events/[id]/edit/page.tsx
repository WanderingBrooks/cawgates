import { PageTitle } from '@/components';
import EventForm from '../../EventForm';
import { EventFormData } from '@/lib/types';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getEventById } from '@/lib/dal';

const EditEventPage = async ({
  params,
}: {
  params: Promise<{ username: string; id: string }>;
}) => {
  const { username, id } = await params;
  const t = await getTranslations('editEvent');

  const { archetype, event, isOwner } = await getEventById({
    ownerUsername: username,
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
      <PageTitle title={t('title')} subtitle={archetype.name} />
      <EventForm
        mode="edit"
        username={username}
        archetypeId={archetype.id}
        eventId={id}
        initialEventData={initialEventData}
      />
    </>
  );
};

export default EditEventPage;
