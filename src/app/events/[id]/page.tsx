import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { Page, Button, MatchTable } from '@/components';
import classes from '../../app.module.css';
import DeleteEventButton from './DeleteEventButton';
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

  const tableRows = event.matches.map(match => ({
    key: match.id,
    archetype: match.opponentArchetype,
    wins: match.wins,
    losses: match.losses,
  }));

  return (
    <Page>
      <div className={classes.pageTitle}>
        <h1>{event.name}</h1>
        <Link href="/events">
          <Button>{tEvents('title')}</Button>
        </Link>
      </div>
      <p>{new Date(event.date).toLocaleDateString()}</p>
      <MatchTable
        rows={tableRows}
        emptyMessage={tEvents('noMatches')}
        labels={{
          archetype: tHome('archetype'),
          wins: tHome('wins'),
          losses: tHome('losses'),
          winRate: tHome('winRate'),
        }}
      />
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
