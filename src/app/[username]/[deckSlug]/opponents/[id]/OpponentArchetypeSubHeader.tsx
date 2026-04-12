'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button, Dialog, OpponentArchetypeForm } from '@/components';
import classes from './opponentArchetypePage.module.css';

const OpponentArchetypeSubHeader = ({
  deckId,
  opponentArchetypeId,
  initialName,
  totalMatches,
  matchWins,
  matchLosses,
  matchDraws,
  isOwner,
  username,
  deckSlug,
}: {
  deckId: string;
  opponentArchetypeId: string;
  initialName: string;
  totalMatches: number;
  matchWins: number;
  matchLosses: number;
  matchDraws: number;
  isOwner: boolean;
  username: string;
  deckSlug: string;
}) => {
  const t = useTranslations('opponentArchetypePage');
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const hasMatches = totalMatches > 0;

  return (
    <>
      <div className={classes.headerRow}>
        <div>
          {hasMatches && (
            <p className="text-emphasis">
              {t('overallRecord', {
                wins: matchWins,
                losses: matchLosses,
                ties: matchDraws,
              })}
            </p>
          )}
        </div>
        <div className={classes.rightButtons}>
          {isOwner && (
            <Button variant="primary" onClick={() => setIsDialogOpen(true)}>
              {t('edit')}
            </Button>
          )}
          <Link href={`/${username}/${deckSlug}`}>
            <Button variant="secondary">{t('viewDeck')}</Button>
          </Link>
        </div>
      </div>
      {isOwner && (
        <Dialog isOpen={isDialogOpen} title={t('editTitle')} usePortal>
          <OpponentArchetypeForm
            mode="edit"
            deckId={deckId}
            opponentArchetypeId={opponentArchetypeId}
            initialName={initialName}
            onSuccess={() => {
              setIsDialogOpen(false);
              router.refresh();
            }}
            onCancel={() => setIsDialogOpen(false)}
          />
        </Dialog>
      )}
    </>
  );
};

export default OpponentArchetypeSubHeader;
