import Link from 'next/link';
import { getTranslations, getFormatter } from 'next-intl/server';
import { formatDate, getMatchRecord } from '@/lib/utils';
import {
  Button,
  Card,
  CardContent,
  PageTitle,
  SectionHeader,
} from '@/components';
import { getEvent } from '@/lib/dal';
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
  const tCommon = await getTranslations('common');
  const formatter = await getFormatter();

  const { event, isOwner } = await getEvent({
    eventId: id,
    ownerUsername: username,
  });

  const { matchWins, matchLosses, matchDraws } = getMatchRecord({
    matches: event.matches,
  });

  return (
    <>
      <PageTitle
        title={event.name}
        subtitle={[
          <span key="deck">{event.deck.name}</span>,
          <span key="date">
            {formatDate({ formatter, date: new Date(event.date) })}
          </span>,
          event.matches.length > 0 && (
            <strong key="record" className="text-number">
              {tCommon('matchRecord', {
                wins: matchWins,
                losses: matchLosses,
                ties: matchDraws,
              })}
            </strong>
          ),
        ]}
        actions={
          <>
            <Link
              href={`/${username}/matchups/${event.deck.formatId}?deck=${encodeURIComponent(event.deck.slug)}`}
            >
              <Button variant="secondary">{t('viewMatchups')}</Button>
            </Link>
            {isOwner && (
              <Link href={`/${username}/events/${id}/edit`}>
                <Button variant="secondary">{t('editEvent')}</Button>
              </Link>
            )}
          </>
        }
      />
      {isOwner && event.notes && (
        <section className={classes.section}>
          <SectionHeader>{t('notesSection')}</SectionHeader>
          <Card>
            <CardContent>
              <div className="prose">
                <Markdown>{event.notes}</Markdown>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
      <MatchSection
        matches={event.matches}
        eventId={id}
        isOwner={isOwner}
        username={username}
      />
    </>
  );
};

export default EventPage;
