import Link from 'next/link';
import { getTranslations, getFormatter } from 'next-intl/server';
import { formatDate } from '@/lib/utils';
import {
  Card,
  CardTitle,
  Button,
  PageTitle,
  SpaceChildrenVertically,
} from '@/components';
import { getEvents } from '@/lib/dal';
import classes from './event.module.css';

const EventsPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const t = await getTranslations('events');
  const formatter = await getFormatter();
  const { username } = await params;

  const { events, isOwner, hasDecks } = await getEvents({
    ownerUsername: username,
  });

  return (
    <>
      <PageTitle title={t('title')} />
      <SpaceChildrenVertically>
        {isOwner &&
          (hasDecks ? (
            <div className={classes.rightAlignedButton}>
              <Link href={`/${username}/events/create`}>
                <Button variant="primary">{t('createEvent')}</Button>
              </Link>
            </div>
          ) : (
            <>
              <p>{t('noDecksHint')}</p>
              <Link href={`/${username}/decks/create`}>
                <Button variant="primary">{t('createDeck')}</Button>
              </Link>
            </>
          ))}

        {events.length === 0 && hasDecks && <p>{t('noEvents')}</p>}

        {events.length > 0 && (
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
                    <div className={classes.eventLinkAndDeckName}>
                      <Link href={`/${username}/events/${event.id}`}>
                        {event.name}
                      </Link>
                      <p>{event.deck.name}</p>
                    </div>
                    <div className={classes.eventDateAndRecord}>
                      <p>
                        {formatDate({ formatter, date: new Date(event.date) })}
                      </p>
                      <p>{t('record', record)}</p>
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
