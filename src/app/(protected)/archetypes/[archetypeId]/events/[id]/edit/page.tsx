import { PageTitle } from '@/components';
import EventForm from '../../EventForm';
import { EventFormData, MatchInput } from '@/lib/types';
import { getTranslations } from 'next-intl/server';
import { getEventForUser } from '@/lib/dal';

const EditEventPage = async ({
  params,
}: {
  params: Promise<{ archetypeId: string; id: string }>;
}) => {
  const { archetypeId, id } = await params;
  const t = await getTranslations('editEvent');

  const { event } = await getEventForUser({ archetypeId, eventId: id });

  const initialEventData: EventFormData = {
    eventName: event.name || '',
    eventDate: event.date.toISOString().split('T')[0],
    notes: event.notes || '',
  };

  const initialMatches: MatchInput[] = event.matches.map(match => ({
    id: match.id,
    opponentArchetype: match.opponentArchetype,
    wins: match.wins,
    losses: match.losses,
  }));

  return (
    <>
      <PageTitle title={t('title')} showLogout />
      <EventForm
        mode="edit"
        archetypeId={archetypeId}
        eventId={id}
        initialEventData={initialEventData}
        initialMatches={initialMatches}
      />
    </>
  );
};

export default EditEventPage;
