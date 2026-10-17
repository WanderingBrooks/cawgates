'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Button,
  Card,
  CardContent,
  CardTitle,
  Dialog,
  SectionHeader,
} from '@/components';
import DeleteMatchButton from './DeleteMatchButton';
import MatchForm from './MatchForm';
import { MatchInputForm } from '@/lib/types';
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
  deckId: string;
  isOwner: boolean;
  username: string;
};

const MatchSection = ({
  matches,
  eventId,
  deckId,
  isOwner,
  username,
}: MatchSectionProps) => {
  const t = useTranslations('event');
  const tCommon = useTranslations('common');
  const tCreateMatch = useTranslations('createMatch');
  const tEditMatch = useTranslations('editMatch');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  const editingMatchData: MatchInputForm | undefined = editingMatch
    ? {
        id: editingMatch.id,
        opponentArchetypeId: editingMatch.opponentArchetypeId,
        wins: editingMatch.wins,
        losses: editingMatch.losses,
        notes: editingMatch.notes ?? '',
      }
    : undefined;

  return (
    <section className={classes.section}>
      <div className={classes.sectionHeader}>
        <SectionHeader>{t('matchesSection')}</SectionHeader>
        {isOwner && (
          <Button variant="primary" onClick={() => setIsAddOpen(true)}>
            {t('addMatch')}
          </Button>
        )}
      </div>

      {matches.length === 0 && <p>{t('noMatches')}</p>}

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
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => setEditingMatch(match)}
                    >
                      {t('editMatch')}
                    </Button>
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

      {isOwner && (
        <>
          <Dialog isOpen={isAddOpen} title={tCreateMatch('title')} usePortal>
            <MatchForm
              mode="create"
              deckId={deckId}
              eventId={eventId}
              onSuccess={() => setIsAddOpen(false)}
              onCancel={() => setIsAddOpen(false)}
            />
          </Dialog>

          <Dialog
            isOpen={editingMatch !== null}
            title={tEditMatch('title')}
            usePortal
          >
            {editingMatch !== null && (
              <MatchForm
                key={editingMatch.id}
                mode="edit"
                deckId={deckId}
                eventId={eventId}
                matchId={editingMatch.id}
                initialMatchData={editingMatchData}
                onSuccess={() => setEditingMatch(null)}
                onCancel={() => setEditingMatch(null)}
                deleteButton={
                  <DeleteMatchButton
                    matchId={editingMatch.id}
                    onDeleted={() => setEditingMatch(null)}
                  />
                }
              />
            )}
          </Dialog>
        </>
      )}
    </section>
  );
};

export default MatchSection;
