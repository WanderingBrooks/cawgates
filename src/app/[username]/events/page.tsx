import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Card, CardTitle, Button, PageTitle } from '@/components';
import { getEventsForUser } from '@/lib/dal';
import classes from './event.module.css';

const EventsPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const t = await getTranslations('events');
  const tAll = await getTranslations('allEvents');

  const { events, isOwner } = await getEventsForUser({ ownerUsername: username });

  return (
    <>
      <PageTitle title={isOwner ? tAll('title') : tAll('guestTitle', { username })} />
      {isOwner && (
        <div className={classes.rightAlignedButton}>
          <Link href={`/${username}/events/create`}>
            <Button variant="primary">{t('createEvent')}</Button>
          </Link>
        </div>
      )}

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
                  <Link href={`/${username}/events/${event.id}`}>
                    {event.name}
                  </Link>
                  <p>{new Date(event.date).toLocaleDateString()}</p>
                  <p>{event.archetype.name}</p>
                </div>
                <p>{t('record', record)}</p>
              </CardTitle>
            </Card>
          );
        })
      )}
    </>
  );
};

export default EventsPage;
