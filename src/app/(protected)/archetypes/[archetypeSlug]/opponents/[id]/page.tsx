import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import Markdown from 'react-markdown';
import { Card, CardContent, CardTitle, PageTitle } from '@/components';
import { getOpponentArchetypeForUser } from '@/lib/dal';
import { cn } from '@/lib/utils';
import DeleteOpponentArchetypeButton from './DeleteOpponentArchetypeButton';
import OpponentArchetypeEditSection from './OpponentArchetypeEditSection';
import classes from './opponentArchetypePage.module.css';

const OpponentArchetypePage = async ({
  params,
}: {
  params: Promise<{ archetypeSlug: string; id: string }>;
}) => {
  const { archetypeSlug, id } = await params;
  const t = await getTranslations('opponentArchetypePage');

  const { archetype, opponentArchetype } = await getOpponentArchetypeForUser({
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
      <OpponentArchetypeEditSection
        archetypeId={archetype.id}
        opponentArchetypeId={opponentArchetype.id}
        initialName={opponentArchetype.name}
        matchWins={matchWins}
        matchLosses={matchLosses}
        matchDraws={matchDraws}
      />
      <p className={cn('text-label', classes.sectionHeader)}>
        {t('matchesSection')}
      </p>
      {opponentArchetype.matches.length === 0 ? (
        <p>{t('noMatches')}</p>
      ) : (
        <div className={classes.matchList}>
          {opponentArchetype.matches.map(match => (
            <Card key={match.id}>
              <CardTitle>
                <div>
                  <Link
                    href={`/archetypes/${archetypeSlug}/events/${match.event.id}`}
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
      <p className={cn('text-label', classes.sectionHeader)}>
        {t('dangerZone')}
      </p>
      <DeleteOpponentArchetypeButton
        opponentArchetypeId={opponentArchetype.id}
        hasMatches={opponentArchetype.matches.length > 0}
      />
    </>
  );
};

export default OpponentArchetypePage;
