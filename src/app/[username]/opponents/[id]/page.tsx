import Link from 'next/link';
import { getTranslations, getFormatter } from 'next-intl/server';
import { cn, formatDate, getMatchResultTint } from '@/lib/utils';
import Markdown from 'react-markdown';
import { PageTitle, SectionHeader } from '@/components';
import { getOpponentArchetype } from '@/lib/dal';
import OpponentArchetypeActions from './OpponentArchetypeActions';
import classes from './opponentArchetypePage.module.css';

const OpponentArchetypePage = async ({
  params,
}: {
  params: Promise<{ username: string; id: string }>;
}) => {
  const { username, id } = await params;
  const t = await getTranslations('opponentArchetypePage');
  const formatter = await getFormatter();

  const { opponentArchetype, isOwner } = await getOpponentArchetype({
    ownerUsername: username,
    opponentArchetypeId: id,
  });

  const matchWins = opponentArchetype.matches.filter(
    m => m.wins > m.losses,
  ).length;

  const matchLosses = opponentArchetype.matches.filter(
    m => m.losses > m.wins,
  ).length;

  const matchDraws = opponentArchetype.matches.filter(
    m => m.wins === m.losses,
  ).length;

  return (
    <>
      <PageTitle
        title={opponentArchetype.name}
        subtitle={
          <>
            <span>{opponentArchetype.format.name}</span>
            {opponentArchetype.matches.length > 0 && (
              <strong className="text-number">
                {t('overallRecord', {
                  wins: matchWins,
                  losses: matchLosses,
                  ties: matchDraws,
                })}
              </strong>
            )}
          </>
        }
        actions={
          <OpponentArchetypeActions
            opponentArchetypeId={opponentArchetype.id}
            formatId={opponentArchetype.formatId}
            initialName={opponentArchetype.name}
            isOwner={isOwner}
            username={username}
          />
        }
      />
      <section className={classes.section}>
        <SectionHeader>{t('matchesSection')}</SectionHeader>
        {opponentArchetype.matches.length === 0 ? (
          <p>{t('noMatches')}</p>
        ) : (
          <div className={classes.matchList}>
            {opponentArchetype.matches.map(match => (
              <article key={match.id} className={classes.matchCard}>
                <div className={classes.matchHeader}>
                  <div className={classes.matchEvent}>
                    <Link
                      href={`/${username}/events/${match.event.id}`}
                      className="text-strong"
                    >
                      {match.event.name}
                    </Link>
                    <span className="text-secondary">
                      {match.event.deck.name}
                    </span>
                  </div>
                  <div className={classes.matchResult}>
                    <span className="text-secondary">
                      {formatDate({
                        formatter,
                        date: new Date(match.event.date),
                      })}
                    </span>
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
                      {t('record', { wins: match.wins, losses: match.losses })}
                    </span>
                  </div>
                </div>
                {isOwner && match.notes && (
                  <div className={classes.matchNotes}>
                    <div className="prose">
                      <Markdown>{match.notes}</Markdown>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default OpponentArchetypePage;
