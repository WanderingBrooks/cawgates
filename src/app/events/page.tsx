import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Page from '@/components/page/page';
import { Card, CardTitle, CardContent } from '@/components/card';
import Button from '@/components/button';
import classes from '../app.module.css';

const EventsPage = async () => {
  const events = await prisma.event.findMany({
    orderBy: { date: 'desc' },
    include: { _count: { select: { matches: true } } },
  });

  return (
    <Page>
      <div className={classes.pageTitle}>
        <h1>Events</h1>
        <Link href="/events/create">
          <Button>Create Event</Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <p>No events found</p>
      ) : (
        events.map(event => (
          <Link key={event.id} href={`/events/${event.id}`}>
            <Card>
              <CardTitle>
                <h2>{event.name}</h2>
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </CardTitle>
              <CardContent>
                <p>{event._count.matches} matche(s)</p>
              </CardContent>
            </Card>
          </Link>
        ))
      )}
    </Page>
  );
};

export default EventsPage;
