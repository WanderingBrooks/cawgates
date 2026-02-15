import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import Page from '@/components/page/page';
import { Card, CardTitle, CardContent } from '@/components/card';
import Button from '@/components/button';
import classes from '../app.module.css';

const EventsPage = async () => {
  const t = await getTranslations('events');

  const events = await prisma.event.findMany({
    orderBy: { date: 'desc' },
    include: { _count: { select: { matches: true } } },
  });

  return (
    <Page>
      <div className={classes.pageTitle}>
        <h1>{t('title')}</h1>
        <Link href="/events/create">
          <Button>{t('createEvent')}</Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <p>{t('noEvents')}</p>
      ) : (
        events.map(event => (
          <Link key={event.id} href={`/events/${event.id}`}>
            <Card>
              <CardTitle>
                <h2>{event.name}</h2>
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </CardTitle>
              <CardContent>
                <p>{t('matchCount')}: {event._count.matches}</p>
              </CardContent>
            </Card>
          </Link>
        ))
      )}
    </Page>
  );
};

export default EventsPage;
