import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Button, MatchTable, PageTitle, FlexRowBetween } from '@/components';
import { getEventForUser } from '@/lib/dal';
import DeleteEventButton from './DeleteEventButton';
import Markdown from 'react-markdown';

const EventPage = async ({
  params,
}: {
  params: Promise<{ archetypeId: string; id: string }>;
}) => {
  const { archetypeId, id } = await params;
  const t = await getTranslations('event');

  const { event } = await getEventForUser({ archetypeId, eventId: id });

  const tableRows = event.matches.map(match => ({
    key: match.id,
    archetype: match.opponentArchetype,
    wins: match.wins,
    losses: match.losses,
  }));

  return (
    <>
      <PageTitle title={event.name} />
      <p>{new Date(event.date).toLocaleDateString()}</p>
      <MatchTable rows={tableRows} />
      {event.notes && <Markdown>{event.notes}</Markdown>}
      <FlexRowBetween>
        <Link href={`/archetypes/${archetypeId}/events/${id}/edit`}>
          <Button variant="primary">{t('edit')}</Button>
        </Link>
        <DeleteEventButton eventId={id} />
      </FlexRowBetween>
    </>
  );
};

export default EventPage;
