import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { getUser } from '@/lib/session';
import { Card, CardTitle, CardContent, Button, PageTitle } from '@/components';

const EventsPage = async ({
  params,
}: {
  params: Promise<{ archetypeId: string }>;
}) => {
  const t = await getTranslations('events');
  const user = await getUser();

  if (!user) {
    return null; // Middleware will redirect
  }

  const { archetypeId } = await params;

  const archetype = await prisma.archetype.findUnique({
    where: { id: archetypeId },
  });

  if (!archetype || archetype.userId !== user.userId) {
    notFound();
  }

  const events = await prisma.event.findMany({
    where: { archetypeId },
    orderBy: { date: 'desc' },
    include: { matches: true },
  });

  return (
    <>
      <PageTitle title={t('title', { archetype: archetype.name })} showLogout />
      <Link href={`/archetypes/${archetypeId}/events/create`}>
        <Button variant="primary">{t('createEvent')}</Button>
      </Link>

      {events.length === 0 ? (
        <p>{t('noEvents')}</p>
      ) : (
        events.map(event => {
          const record = event.matches.reduce(
            (recordSoFar, match) => {
              const copyOfRecordSoFar = { ...recordSoFar };

              if (match.wins > match.losses) {
                copyOfRecordSoFar.wins += 1;
              } else if (match.losses > match.wins) {
                copyOfRecordSoFar.losses += 1;
              } else {
                copyOfRecordSoFar.ties += 1;
              }

              return copyOfRecordSoFar;
            },
            { wins: 0, losses: 0, ties: 0 },
          );

          return (
            <Link
              key={event.id}
              href={`/archetypes/${archetypeId}/events/${event.id}`}
            >
              <Card>
                <CardTitle>
                  <h2>{event.name}</h2>
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </CardTitle>
                <CardContent>
                  <p>{t('record', record)}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })
      )}
    </>
  );
};

export default EventsPage;
