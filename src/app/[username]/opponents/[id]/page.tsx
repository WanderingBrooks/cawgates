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
} from '@/components';
import { getOpponentArchetype } from '@/lib/dal';
import OpponentArchetypeActions from './OpponentArchetypeActions';
import classes from './opponentArchetypePage.module.css';

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

  const { opponentArchetype, decks, selectedDeck, isOwner } =
    await getOpponentArchetype({
      ownerUsername: username,
      opponentArchetypeId: id,
      deckSlug: typeof deck === 'string' ? deck : undefined,
    });

  const { matchWins, matchLosses, matchDraws } = getMatchRecord({
    matches: opponentArchetype.matches,
  });

  return (
    <>
      <PageTitle
        title={opponentArchetype.name}
        subtitle={[
          <span key="format">{opponentArchetype.format.name}</span>,
          opponentArchetype.matches.length > 0 && (
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
          <OpponentArchetypeActions
            opponentArchetypeId={opponentArchetype.id}
            formatId={opponentArchetype.formatId}
            initialName={opponentArchetype.name}
            username={username}
            isOwner={isOwner}
            deckSlug={selectedDeck?.slug ?? null}
          />
        }
      />
      <DeckFilter decks={decks} selectedDeckSlug={selectedDeck?.slug ?? null} />
      <section className={classes.section}>
        <SectionHeader>{t('matchesSection')}</SectionHeader>
        {opponentArchetype.matches.length === 0 ? (
          <p>{selectedDeck ? t('noDeckMatches') : t('noMatches')}</p>
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
