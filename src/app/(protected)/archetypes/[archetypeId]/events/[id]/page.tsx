import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { getUser } from '@/lib/session';
import { Button, MatchTable, PageTitle, FlexRowBetween } from '@/components';
import DeleteEventButton from './DeleteEventButton';
import Markdown from 'react-markdown';

const EventPage = async ({
  params,
}: {
  params: Promise<{ archetypeId: string; id: string }>;
}) => {
  const user = await getUser();

  if (!user) {
    return null; // Middleware will redirect
  }

  const { archetypeId, id } = await params;
  const t = await getTranslations('event');

  const event = await prisma.event.findUnique({
    where: { id, archetypeId },
    include: { matches: { orderBy: { order: 'asc' } } },
  });

  if (!event) {
    notFound();
  }

  const tableRows = event.matches.map(match => ({
    key: match.id,
    archetype: match.opponentArchetype,
    wins: match.wins,
    losses: match.losses,
  }));

  return (
    <>
      <PageTitle title={event.name} showLogout />
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
