import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
  Button,
  Card,
  CardContent,
  CardTitle,
  SectionHeader,
} from '@/components';
import { cn, getMatchResultTint } from '@/lib/utils';
import classes from './matchSection.module.css';
import Markdown from 'react-markdown';

type Match = {
  id: string;
  opponentArchetypeId: string;
  wins: number;
  losses: number;
  notes: string | null;
  opponentArchetype: {
    name: string;
  };
};

type MatchSectionProps = {
  matches: Match[];
  eventId: string;
  isOwner: boolean;
  username: string;
};

const MatchSection = ({
  matches,
  eventId,
  isOwner,
  username,
}: MatchSectionProps) => {
  const t = useTranslations('event');
  const tCommon = useTranslations('common');

  const matchesHref = `/${username}/events/${eventId}/matches`;

  return (
    <section className={classes.section}>
      <div className={classes.sectionHeader}>
        <SectionHeader>{t('matchesSection')}</SectionHeader>
        {isOwner && (
          <Link href={`${matchesHref}/create`}>
            <Button variant="primary">{t('addMatch')}</Button>
          </Link>
        )}
      </div>

      {matches.length === 0 && (
        <p>{isOwner ? t('noMatches') : t('noMatchesGuest')}</p>
      )}

      {matches.length > 0 && (
        <div className={classes.matchList}>
          {matches.map(match => (
            <Card key={match.id}>
              <CardTitle>
                <div className={classes.matchSummary}>
                  <Link
                    href={`/${username}/opponents/${match.opponentArchetypeId}`}
                    className="text-strong"
                  >
                    {match.opponentArchetype.name}
                  </Link>
                  <span
                    className={cn(
                      'text-number',
                      'text-strong',
                      classes.record,
                      getMatchResultTint({
                        wins: match.wins,
                        losses: match.losses,
                      }),
                    )}
                  >
                    {tCommon('gameRecord', {
                      wins: match.wins,
                      losses: match.losses,
                    })}
                  </span>
                </div>
                {isOwner && (
                  <div className={classes.matchActions}>
                    <Link href={`${matchesHref}/${match.id}/edit`}>
                      <Button variant="secondary">{t('editMatch')}</Button>
                    </Link>
                  </div>
                )}
              </CardTitle>
              {isOwner && match.notes && (
                <CardContent>
                  <div className="prose">
                    <Markdown>{match.notes}</Markdown>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default MatchSection;
