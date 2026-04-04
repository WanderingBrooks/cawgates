'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button, Dialog, OpponentArchetypeForm } from '@/components';
import classes from './opponentArchetypePage.module.css';

const OpponentArchetypeSubHeader = ({
  archetypeId,
  opponentArchetypeId,
  initialName,
  matchWins,
  matchLosses,
  matchDraws,
}: {
  archetypeId: string;
  opponentArchetypeId: string;
  initialName: string;
  matchWins: number;
  matchLosses: number;
  matchDraws: number;
}) => {
  const t = useTranslations('opponentArchetypePage');
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const hasMatches = matchWins + matchLosses + matchDraws > 0;

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
        <Button variant="primary" onClick={() => setIsDialogOpen(true)}>
          {t('edit')}
        </Button>
      </div>
      <Dialog isOpen={isDialogOpen} title={t('editTitle')} usePortal>
        <OpponentArchetypeForm
          mode="edit"
          archetypeId={archetypeId}
          opponentArchetypeId={opponentArchetypeId}
          initialName={initialName}
          onSuccess={() => {
            setIsDialogOpen(false);
            router.refresh();
          }}
          onCancel={() => setIsDialogOpen(false)}
        />
      </Dialog>
    </>
  );
};

export default OpponentArchetypeSubHeader;
