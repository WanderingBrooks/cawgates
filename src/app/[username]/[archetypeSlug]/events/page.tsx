import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getFormatter } from 'next-intl/server';
import { Card, CardTitle, Button, PageTitle, SpaceChildrenVertically } from '@/components';
import { getEvents } from '@/lib/dal';
import classes from './event.module.css';

const EventsPage = async ({
  params,
}: {
  params: Promise<{ username: string; archetypeSlug: string }>;
}) => {
  const t = await getTranslations('events');
  const formatter = await getFormatter();
  const { username, archetypeSlug } = await params;

  const { archetype, events, isOwner } = await getEvents({ ownerUsername: username, archetypeSlug });

  return (
    <>
      <PageTitle title={t('title')} subtitle={archetype.name} />
      <SpaceChildrenVertically>
        {isOwner && (
          <div className={classes.rightAlignedButton}>
            <Link href={`/${username}/${archetype.slug}/events/create`}>
              <Button variant="primary">{t('createEvent')}</Button>
            </Link>
          </div>
        )}

        {events.length === 0 ? (
          <p>{t('noEvents')}</p>
        ) : (
          <SpaceChildrenVertically>
            {events.map(event => {
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
                  <CardTitle align="start">
                    <Link
                      className={classes.eventName}
                      href={`/${username}/${archetype.slug}/events/${event.id}`}
                    >
                      {event.name}
                    </Link>
                    <div className={classes.eventMeta}>
                      <p className={classes.eventDate}>{formatter.dateTime(new Date(event.date), { dateStyle: 'medium' })}</p>
                      <p className={classes.record}>{t('record', record)}</p>
                    </div>
                  </CardTitle>
                </Card>
              );
            })}
          </SpaceChildrenVertically>
        )}
      </SpaceChildrenVertically>
    </>
  );
};

export default EventsPage;
