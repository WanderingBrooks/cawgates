import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Page from '@/components/page/page';
import classes from '../events.module.css';
import Button from '@/components/button';
import DeleteEventButton from './delete-event-button';
import SpaceChildrenVertically from '@/components/space-children-vertically';

const EventPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: { matches: true },
  });

  if (!event) {
    notFound();
  }

  return (
    <Page>
      <div className={classes.pageTitle}>
        <h1>{event.name}</h1>
        <Link href="/events">
          <Button>Back to Events</Button>
        </Link>
      </div>
      <p>{new Date(event.date).toLocaleDateString()}</p>
      {event.notes && <p>{event.notes}</p>}
      {event.matches.length === 0 ? (
        <p>No matches found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Opponent Archetype</th>
              <th>Wins</th>
              <th>Losses</th>
            </tr>
          </thead>
          <tbody>
            {event.matches.map(match => (
              <tr key={match.id}>
                <td>{match.opponentArchetype}</td>
                <td>{match.wins}</td>
                <td>{match.losses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <DeleteEventButton eventId={id} />
    </Page>
  );
};

export default EventPage;
