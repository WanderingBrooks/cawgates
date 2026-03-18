import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import { Card, CardTitle, CardContent, Button, PageTitle } from '@/components';
import { getArchetypeForUser } from '@/lib/dal';

const EventsPage = async ({
  params,
}: {
  params: Promise<{ archetypeId: string }>;
}) => {
  const t = await getTranslations('events');
  const { archetypeId } = await params;

  const { archetype } = await getArchetypeForUser({ archetypeId });

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
