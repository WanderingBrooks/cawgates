'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { deleteMatch } from '@/app/actions/matches';
import { Button, ErrorMessage, Dialog, SectionHeader } from '@/components';
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
  const tDelete = useTranslations('deleteMatchButton');
  const tCreateMatch = useTranslations('createMatch');
  const tEditMatch = useTranslations('editMatch');

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async ({ matchId }: { matchId: string }) => {
    if (!confirm(tDelete('deleteConfirm'))) {
      return;
    }

    setDeletingId(matchId);
    setDeleteError(null);

    const result = await deleteMatch(matchId);

    if (result && result.error) {
      setDeleteError(result.error);
      setDeletingId(null);
    }
  };

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

      {deleteError && <ErrorMessage error={deleteError} />}

      {matches.length === 0 && <p>{t('noMatches')}</p>}

      {matches.length > 0 && (
        <div className={classes.matchList}>
          {matches.map(match => (
            <article key={match.id} className={classes.matchCard}>
              <div className={classes.matchHeader}>
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
                    {t('gameRecord', {
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
                    <Button
                      variant="danger"
                      size="small"
                      disabled={deletingId === match.id}
                      onClick={() => handleDelete({ matchId: match.id })}
                    >
                      {deletingId === match.id
                        ? tDelete('deleting')
                        : tDelete('delete')}
                    </Button>
                  </div>
                )}
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
              />
            )}
          </Dialog>
        </>
      )}
    </section>
  );
};

export default MatchSection;
