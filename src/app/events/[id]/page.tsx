import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import Page from '@/components/page/page';
import classes from '../../app.module.css';
import Button from '@/components/button';
import DeleteEventButton from './delete-event-button';
import Markdown from 'react-markdown';

const EventPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const tEvents = await getTranslations('events');
  const tHome = await getTranslations('home');
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
          <Button>{tEvents('title')}</Button>
        </Link>
      </div>
      <p>{new Date(event.date).toLocaleDateString()}</p>
      {event.matches.length === 0 ? (
        <p>{tEvents('noMatches')}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>{tHome('archetype')}</th>
              <th>{tHome('wins')}</th>
              <th>{tHome('losses')}</th>
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
      {event.notes && <Markdown>{event.notes}</Markdown>}

      <div className={classes.flexRowBetween}>
        <Link href={`/events/${id}/edit`}>
          <Button>{tEvents('edit')}</Button>
        </Link>
        <DeleteEventButton eventId={id} />
      </div>
    </Page>
  );
};

export default EventPage;
