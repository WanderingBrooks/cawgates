import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Button, PageTitle } from '@/components';
import { getEventForUser } from '@/lib/dal';
import DeleteEventButton from './DeleteEventButton';
import MatchSection from './MatchSection';
import Markdown from 'react-markdown';
import classes from './eventPage.module.css';

const EventPage = async ({
  params,
}: {
  params: Promise<{ archetypeSlug: string; id: string }>;
}) => {
  const { archetypeSlug, id } = await params;
  const t = await getTranslations('event');

  const { archetype, event } = await getEventForUser({
    archetypeSlug,
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
            <p className={classes.record}>
              {t('overallRecord', {
                wins: matchWins,
                losses: matchLosses,
                ties: matchTies,
              })}
            </p>
          )}
        </div>
        <Link href={`/archetypes/${archetype.slug}/events/${id}/edit`}>
          <Button variant="primary">{t('editEvent')}</Button>
        </Link>
      </div>
      {event.notes && (
        <>
          <p className={classes.sectionHeader}>{t('notesSection')}</p>
          <Markdown>{event.notes}</Markdown>
        </>
      )}
      <p className={classes.sectionHeader}>{t('matchesSection')}</p>
      <MatchSection
        matches={event.matches}
        eventId={id}
        archetypeId={archetype.id}
      />
      <p className={classes.sectionHeader}>{t('dangerZone')}</p>
      <DeleteEventButton eventId={id} />
    </>
  );
};

export default EventPage;
