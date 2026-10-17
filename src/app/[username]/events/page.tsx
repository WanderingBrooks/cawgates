import Link from 'next/link';
import { getTranslations, getFormatter } from 'next-intl/server';
import { formatDate, getMatchRecord } from '@/lib/utils';
import { Button, PageTitle } from '@/components';
import { getEvents } from '@/lib/dal';

const EventsPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const t = await getTranslations('events');
  const tCommon = await getTranslations('common');
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
                <th>{t('deck')}</th>
                <th className="text-number">{t('recordHeader')}</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => {
                const { matchWins, matchLosses, matchDraws } = getMatchRecord({
                  matches: event.matches,
                });

                return (
                  <tr key={event.id}>
                    <td className="text-nowrap">
                      {formatDate({ formatter, date: new Date(event.date) })}
                    </td>
                    <td>
                      <Link href={`/${username}/events/${event.id}`}>
                        {event.name}
                      </Link>
                    </td>
                    <td>{event.deck.name}</td>
                    <td className="text-number">
                      {tCommon('matchRecord', {
                        wins: matchWins,
                        losses: matchLosses,
                        ties: matchDraws,
                      })}
                    </td>
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
