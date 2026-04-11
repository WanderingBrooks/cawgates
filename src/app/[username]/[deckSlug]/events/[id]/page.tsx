import Link from 'next/link';
import { getTranslations, getFormatter } from 'next-intl/server';
import { Button, PageTitle, SectionHeader } from '@/components';
import { getEvent } from '@/lib/dal';
import DeleteEventButton from './DeleteEventButton';
import MatchSection from './MatchSection';
import Markdown from 'react-markdown';
import classes from './eventPage.module.css';

const EventPage = async ({
  params,
}: {
  params: Promise<{ username: string; deckSlug: string; id: string }>;
}) => {
  const { username, deckSlug, id } = await params;
  const t = await getTranslations('event');
  const formatter = await getFormatter();

  const { deck, event, isOwner } = await getEvent({
    ownerUsername: username,
    deckSlug,
    eventId: id,
  });

  const matchWins = event.matches.filter(m => m.wins > m.losses).length;
  const matchLosses = event.matches.filter(m => m.losses > m.wins).length;
  const matchTies = event.matches.filter(m => m.wins === m.losses).length;

  return (
    <>
      <PageTitle title={event.name} subtitle={deck.name} />
      <div className={classes.headerRow}>
        <div>
          <p className={classes.meta}>
            {formatter.dateTime(new Date(event.date), { dateStyle: 'medium' })}
          </p>
          {event.matches.length > 0 && (
            <p className="text-emphasis">
              {t('matchRecord', {
                wins: matchWins,
                losses: matchLosses,
                ties: matchTies,
              })}
            </p>
          )}
        </div>
        {isOwner && (
          <Link href={`/${username}/${deck.slug}/events/${id}/edit`}>
            <Button variant="primary">{t('editEvent')}</Button>
          </Link>
        )}
      </div>
      {event.notes && (
        <>
          <SectionHeader>{t('notesSection')}</SectionHeader>
          <Markdown>{event.notes}</Markdown>
        </>
      )}
      <SectionHeader>{t('matchesSection')}</SectionHeader>
      <MatchSection
        matches={event.matches}
        eventId={id}
        deckId={deck.id}
        isOwner={isOwner}
        username={username}
        deckSlug={deck.slug}
      />
      {isOwner && (
        <>
          <SectionHeader>{t('dangerZone')}</SectionHeader>
          <DeleteEventButton eventId={id} />
        </>
      )}
    </>
  );
};

export default EventPage;
