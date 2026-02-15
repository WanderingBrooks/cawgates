import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Page, Button } from '@/components';
import EventForm from '../../EventForm';
import classes from '../../../app.module.css';
import { EventFormInputData, MatchInputData } from '@/lib/types';

const EditEventPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: { matches: true },
  });

  if (!event) {
    notFound();
  }

  const allMatches = await prisma.match.findMany({
    select: { opponentArchetype: true },
    distinct: ['opponentArchetype'],
    orderBy: { opponentArchetype: 'asc' },
  });

  const archetypes = allMatches.map(match => match.opponentArchetype);

  const initialEventData: EventFormInputData = {
    eventName: event.name || '',
    eventDate: event.date.toISOString().split('T')[0],
    notes: event.notes || '',
  };

  const initialMatches: MatchInputData[] = event.matches.map(match => ({
    id: match.id,
    opponentArchetype: match.opponentArchetype,
    wins: match.wins,
    losses: match.losses,
  }));

  return (
    <Page>
      <div className={classes.pageTitle}>
        <h1>Edit Event</h1>
        <Link href={`/events/${id}`}>
          <Button>Cancel</Button>
        </Link>
      </div>

      <EventForm
        archetypes={archetypes}
        mode="edit"
        eventId={id}
        initialEventData={initialEventData}
        initialMatches={initialMatches}
      />
    </Page>
  );
};

export default EditEventPage;
