import Link from 'next/link';
import { getTranslations, getFormatter } from 'next-intl/server';
import { cn, formatDate } from '@/lib/utils';
import { Button, PageTitle } from '@/components';
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
      <PageTitle
        title={t('title')}
        actions={
          isOwner &&
          hasDecks && (
            <Link href={`/${username}/events/create`}>
              <Button variant="primary">{t('createEvent')}</Button>
            </Link>
          )
        }
      />

      {isOwner && !hasDecks && (
        <>
          <p>{t('noDecksHint')}</p>
          <div>
            <Link href={`/${username}/decks/create`}>
              <Button variant="primary">{t('createDeck')}</Button>
            </Link>
          </div>
        </>
      )}

      {events.length === 0 && hasDecks && <p>{t('noEvents')}</p>}

      {events.length > 0 && (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>{t('date')}</th>
                <th>{t('event')}</th>
                <th className={classes.deckColumn}>{t('deck')}</th>
                <th className="text-number">{t('recordHeader')}</th>
              </tr>
            </thead>
            <tbody>
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
                  <tr key={event.id}>
                    <td className={classes.date}>
                      {formatDate({ formatter, date: new Date(event.date) })}
                    </td>
                    <td>
                      <Link href={`/${username}/events/${event.id}`}>
                        {event.name}
                      </Link>
                      {/* On phones the deck column is hidden and the deck
                          shows under the event name instead */}
                      <span
                        className={cn(
                          'text-small',
                          'text-secondary',
                          classes.deckInline,
                        )}
                      >
                        {event.deck.name}
                      </span>
                    </td>
                    <td className={classes.deckColumn}>{event.deck.name}</td>
                    <td className="text-number">{t('record', record)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default EventsPage;
