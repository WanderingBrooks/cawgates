import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { getUser } from '@/lib/session';
import {
  Page,
  Card,
  CardTitle,
  CardContent,
  Button,
  PageTitle,
} from '@/components';

const EventsPage = async () => {
  const t = await getTranslations('events');
  const user = await getUser();

  if (!user) {
    return null; // Middleware will redirect
  }

  const events = await prisma.event.findMany({
    where: { userId: user.userId },
    orderBy: { date: 'desc' },
    include: { _count: { select: { matches: true } } },
  });

  return (
    <Page>
      <PageTitle>
        <h1>{t('title')}</h1>
        <Link href="/events/create">
          <Button>{t('createEvent')}</Button>
        </Link>
      </PageTitle>

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
                <p>{t('matchCount', { count: event._count.matches })}</p>
              </CardContent>
            </Card>
          </Link>
        ))
      )}
    </Page>
  );
};

export default EventsPage;
