import type { ReactNode } from 'react';
import Link from 'next/link';
import { getTranslations, getFormatter } from 'next-intl/server';
import {
  cn,
  formatDate,
  getMatchRecord,
  getMatchResultTint,
} from '@/lib/utils';
import Markdown from 'react-markdown';
import {
  Card,
  CardContent,
  CardTitle,
  DeckFilter,
  PageTitle,
  SectionHeader,
  Tooltip,
} from '@/components';
import { getOpponentArchetype } from '@/lib/dal';
import OpponentArchetypeActions from './OpponentArchetypeActions';
import classes from './opponentArchetypePage.module.css';

const renderNumber = (chunks: ReactNode) => (
  <strong className="text-number">{chunks}</strong>
);

const OpponentArchetypePage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ username: string; id: string }>;
  searchParams: Promise<{ deck?: string | string[] }>;
}) => {
  const [{ username, id }, { deck }] = await Promise.all([
    params,
    searchParams,
  ]);

  const t = await getTranslations('opponentArchetypePage');
  const tCommon = await getTranslations('common');
  const formatter = await getFormatter();

  const { opponentArchetype, decks, selectedDeck, hasMatches, isOwner } =
    await getOpponentArchetype({
      ownerUsername: username,
      opponentArchetypeId: id,
      deckSlug: typeof deck === 'string' ? deck : undefined,
    });

  const { matchWins, matchLosses, matchDraws } = getMatchRecord({
    matches: opponentArchetype.matches,
  });

  const totalMatches = opponentArchetype.matches.length;

  return (
    <>
      <PageTitle
        title={opponentArchetype.name}
        subtitle={[
          <span key="format">{opponentArchetype.format.name}</span>,
          totalMatches > 0 && (
            <strong key="record" className="text-number">
              {tCommon('matchRecord', {
                wins: matchWins,
                losses: matchLosses,
                ties: matchDraws,
              })}
            </strong>
          ),
          totalMatches > 0 && (
            <span key="winRate">
              {tCommon.rich('matchWinPct', {
                rate: formatter.number(matchWins / totalMatches, {
                  style: 'percent',
                  maximumFractionDigits: 1,
                }),
                num: renderNumber,
                explainer: chunks => (
                  <Tooltip content={tCommon('matchWinPctExplainer')}>
                    {chunks}
                  </Tooltip>
                ),
              })}
            </span>
          ),
        ]}
        actions={
          <div className={classes.titleButtons}>
            <OpponentArchetypeActions
              opponentArchetypeId={opponentArchetype.id}
              formatId={opponentArchetype.formatId}
              initialName={opponentArchetype.name}
              initialIsRogue={opponentArchetype.isRogue}
              username={username}
              isOwner={isOwner}
              deckSlug={selectedDeck?.slug ?? null}
              hasMatches={hasMatches}
            />
          </div>
        }
      />
      {/* No deck has played an archetype without matches */}
      {decks.length > 0 && (
        <DeckFilter
          decks={decks}
          selectedDeckSlug={selectedDeck?.slug ?? null}
        />
      )}
      <section className={classes.section}>
        <SectionHeader>{t('matchesSection')}</SectionHeader>
        {totalMatches === 0 ? (
          // Only the owner gets here: guests can't open an archetype
          // without matches
          <p>{t('noMatches')}</p>
        ) : (
          <div className={classes.matchList}>
            {opponentArchetype.matches.map(match => (
              <Card key={match.id}>
                <CardTitle>
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
                      {tCommon('gameRecord', {
                        wins: match.wins,
                        losses: match.losses,
                      })}
                    </span>
                  </div>
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
    </>
  );
};

export default OpponentArchetypePage;
