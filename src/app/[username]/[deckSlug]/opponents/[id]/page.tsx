import Link from 'next/link';
import { getTranslations, getFormatter } from 'next-intl/server';
import Markdown from 'react-markdown';
import {
  Card,
  CardContent,
  CardTitle,
  PageTitle,
  SectionHeader,
} from '@/components';
import { getOpponentArchetype } from '@/lib/dal';
import DeleteOpponentArchetypeButton from './DeleteOpponentArchetypeButton';
import OpponentArchetypeSubHeader from './OpponentArchetypeSubHeader';
import classes from './opponentArchetypePage.module.css';

const OpponentArchetypePage = async ({
  params,
}: {
  params: Promise<{ username: string; deckSlug: string; id: string }>;
}) => {
  const { username, deckSlug, id } = await params;
  const t = await getTranslations('opponentArchetypePage');
  const formatter = await getFormatter();

  const { deck, opponentArchetype, isOwner } = await getOpponentArchetype({
    ownerUsername: username,
    deckSlug,
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
      <PageTitle title={opponentArchetype.name} subtitle={deck.name} />
      <OpponentArchetypeSubHeader
        deckId={deck.id}
        opponentArchetypeId={opponentArchetype.id}
        initialName={opponentArchetype.name}
        totalMatches={opponentArchetype.matches.length}
        matchWins={matchWins}
        matchLosses={matchLosses}
        matchDraws={matchDraws}
        isOwner={isOwner}
        username={username}
        deckSlug={deckSlug}
      />
      <SectionHeader>{t('matchesSection')}</SectionHeader>
      {opponentArchetype.matches.length === 0 ? (
        <p>{t('noMatches')}</p>
      ) : (
        <div className={classes.matchList}>
          {opponentArchetype.matches.map(match => (
            <Card key={match.id}>
              <CardTitle>
                <div>
                  <Link href={`/${username}/events/${match.event.id}`}>
                    {match.event.name}
                  </Link>
                  <p>
                    {formatter.dateTime(new Date(match.event.date), {
                      dateStyle: 'medium',
                    })}
                  </p>
                </div>
                <span>
                  {t('record', { wins: match.wins, losses: match.losses })}
                </span>
              </CardTitle>
              {match.notes && (
                <CardContent>
                  <Markdown>{match.notes}</Markdown>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
      {isOwner && (
        <>
          <SectionHeader>{t('dangerZone')}</SectionHeader>
          <DeleteOpponentArchetypeButton
            opponentArchetypeId={opponentArchetype.id}
            hasMatches={opponentArchetype.matches.length > 0}
          />
        </>
      )}
    </>
  );
};

export default OpponentArchetypePage;
