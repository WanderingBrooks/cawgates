import { PageTitle } from '@/components';
import EventForm from '../../EventForm';
import { EventFormData, MatchInput } from '@/lib/types';
import { getTranslations } from 'next-intl/server';
import { getEventForUser } from '@/lib/dal';

const EditEventPage = async ({
  params,
}: {
  params: Promise<{ archetypeSlug: string; id: string }>;
}) => {
  const { archetypeSlug, id } = await params;
  const t = await getTranslations('editEvent');

  const { archetype, event } = await getEventForUser({
    archetypeSlug,
    eventId: id,
  });

  const initialEventData: EventFormData = {
    eventName: event.name || '',
    eventDate: event.date.toISOString().split('T')[0],
    notes: event.notes || '',
  };

  const initialMatches: MatchInput[] = event.matches.map(match => ({
    id: match.id,
    opponentArchetypeId: match.opponentArchetypeId,
    wins: match.wins,
    losses: match.losses,
  }));

  return (
    <>
      <PageTitle title={t('title')} subtitle={archetype.name} />
      <EventForm
        mode="edit"
        archetypeId={archetype.id}
        archetypeSlug={archetype.slug}
        eventId={id}
        initialEventData={initialEventData}
        initialMatches={initialMatches}
      />
    </>
  );
};

export default EditEventPage;
