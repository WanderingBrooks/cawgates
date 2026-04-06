import { PageTitle } from '@/components';
import EventForm from '../../EventForm';
import { EventFormData } from '@/lib/types';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getEvent } from '@/lib/dal';

const EditEventPage = async ({
  params,
}: {
  params: Promise<{ username: string; archetypeSlug: string; id: string }>;
}) => {
  const { username, archetypeSlug, id } = await params;
  const t = await getTranslations('editEvent');

  const { archetype, event, isOwner } = await getEvent({
    ownerUsername: username,
    archetypeSlug,
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
        archetypeSlug={archetype.slug}
        eventId={id}
        initialEventData={initialEventData}
      />
    </>
  );
};

export default EditEventPage;
