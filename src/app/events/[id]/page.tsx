import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { getUser } from '@/lib/session';
import {
  Page,
  Button,
  MatchTable,
  PageTitle,
  FlexRowBetween,
} from '@/components';
import DeleteEventButton from './DeleteEventButton';
import Markdown from 'react-markdown';

const EventPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const user = await getUser();

  if (!user) {
    return null; // Middleware will redirect
  }

  const { id } = await params;
  const t = await getTranslations('event');

  const event = await prisma.event.findUnique({
    where: { id, userId: user.userId },
    include: { matches: true },
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
    <Page>
      <PageTitle title={event.name} />
      <p>{new Date(event.date).toLocaleDateString()}</p>
      <MatchTable rows={tableRows} />
      {event.notes && <Markdown>{event.notes}</Markdown>}
      <FlexRowBetween>
        <Link href={`/events/${id}/edit`}>
          <Button>{t('edit')}</Button>
        </Link>
        <DeleteEventButton eventId={id} />
      </FlexRowBetween>
    </Page>
  );
};

export default EventPage;
