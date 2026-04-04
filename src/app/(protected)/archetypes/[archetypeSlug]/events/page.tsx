import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Card, CardTitle, Button, PageTitle } from '@/components';
import { getEventsForArchetype } from '@/lib/dal';
import classes from './event.module.css';

const EventsPage = async ({
  params,
}: {
  params: Promise<{ archetypeSlug: string }>;
}) => {
  const t = await getTranslations('events');
  const { archetypeSlug } = await params;

  const { archetype, events } = await getEventsForArchetype({ archetypeSlug });

  return (
    <>
      <PageTitle title={t('title')} subtitle={archetype.name} />
      <div className={classes.rightAlignedButton}>
        <Link href={`/archetypes/${archetype.slug}/events/create`}>
          <Button variant="primary">{t('createEvent')}</Button>
        </Link>
      </div>

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
            <Card key={event.id}>
              <CardTitle>
                <div>
                  <Link
                    href={`/archetypes/${archetype.slug}/events/${event.id}`}
                  >
                    <h2>{event.name}</h2>
                  </Link>
                  <p>{new Date(event.date).toLocaleDateString()}</p>
                </div>
                <span className="text-emphasis">{t('record', record)}</span>
              </CardTitle>
            </Card>
          );
        })
      )}
    </>
  );
};

export default EventsPage;
