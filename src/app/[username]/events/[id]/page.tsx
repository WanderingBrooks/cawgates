import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Button, PageTitle, SectionHeader } from '@/components';
import { getEventById } from '@/lib/dal';
import DeleteEventButton from './DeleteEventButton';
import MatchSection from './MatchSection';
import Markdown from 'react-markdown';
import classes from './eventPage.module.css';

const EventPage = async ({
  params,
}: {
  params: Promise<{ username: string; id: string }>;
}) => {
  const { username, id } = await params;
  const t = await getTranslations('event');

  const { archetype, event, isOwner } = await getEventById({
    ownerUsername: username,
    eventId: id,
  });

  const matchWins = event.matches.filter(m => m.wins > m.losses).length;
  const matchLosses = event.matches.filter(m => m.losses > m.wins).length;
  const matchTies = event.matches.filter(m => m.wins === m.losses).length;

  return (
    <>
      <PageTitle title={event.name} subtitle={archetype.name} />
      <div className={classes.headerRow}>
        <div>
          <p className={classes.meta}>
            {new Date(event.date).toLocaleDateString()}
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
          <Link href={`/${username}/events/${id}/edit`}>
            <Button variant="primary">{t('editEvent')}</Button>
          </Link>
        )}
      </div>
      <div className={classes.archetypeRow}>
        <p>{archetype.name}</p>
        <Link href={`/${username}/${archetype.slug}`}>
          <Button variant="secondary">{t('viewArchetype')}</Button>
        </Link>
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
        archetypeId={archetype.id}
        isOwner={isOwner}
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
