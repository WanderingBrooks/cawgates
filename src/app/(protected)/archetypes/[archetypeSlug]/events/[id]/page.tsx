import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Button, RecordTable, PageTitle, FlexRowBetween } from '@/components';
import { getEventForUser } from '@/lib/dal';
import DeleteEventButton from './DeleteEventButton';
import Markdown from 'react-markdown';

const EventPage = async ({
  params,
}: {
  params: Promise<{ archetypeSlug: string; id: string }>;
}) => {
  const { archetypeSlug, id } = await params;
  const t = await getTranslations('event');

  const { archetype, event } = await getEventForUser({
    archetypeSlug,
    eventId: id,
  });

  const tableRows = event.matches.map(match => ({
    key: match.id,
    archetype: match.opponentArchetype,
    wins: match.wins,
    losses: match.losses,
  }));

  return (
    <>
      <PageTitle title={event.name} subtitle={archetype.name} />
      <p>{new Date(event.date).toLocaleDateString()}</p>
      <RecordTable rows={tableRows} />
      {event.notes && <Markdown>{event.notes}</Markdown>}
      <FlexRowBetween>
        <Link href={`/archetypes/${archetype.slug}/events/${id}/edit`}>
          <Button variant="primary">{t('edit')}</Button>
        </Link>
        <DeleteEventButton eventId={id} />
      </FlexRowBetween>
    </>
  );
};

export default EventPage;
