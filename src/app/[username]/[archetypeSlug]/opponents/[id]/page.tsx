import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import Markdown from 'react-markdown';
import { Card, CardContent, CardTitle, PageTitle, SectionHeader } from '@/components';
import { getOpponentArchetype } from '@/lib/dal';
import DeleteOpponentArchetypeButton from './DeleteOpponentArchetypeButton';
import OpponentArchetypeSubHeader from './OpponentArchetypeSubHeader';
import classes from './opponentArchetypePage.module.css';

const OpponentArchetypePage = async ({
  params,
}: {
  params: Promise<{ username: string; archetypeSlug: string; id: string }>;
}) => {
  const { username, archetypeSlug, id } = await params;
  const t = await getTranslations('opponentArchetypePage');

  const { archetype, opponentArchetype, isOwner } = await getOpponentArchetype({
    ownerUsername: username,
    archetypeSlug,
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
      <PageTitle title={opponentArchetype.name} subtitle={archetype.name} />
      <OpponentArchetypeSubHeader
        archetypeId={archetype.id}
        opponentArchetypeId={opponentArchetype.id}
        initialName={opponentArchetype.name}
        totalMatches={opponentArchetype.matches.length}
        matchWins={matchWins}
        matchLosses={matchLosses}
        matchDraws={matchDraws}
        isOwner={isOwner}
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
                  <Link
                    href={`/${username}/${archetypeSlug}/events/${match.event.id}`}
                  >
                    {match.event.name}
                  </Link>
                  <p>{new Date(match.event.date).toLocaleDateString()}</p>
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
