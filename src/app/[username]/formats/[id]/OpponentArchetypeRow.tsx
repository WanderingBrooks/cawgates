'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormatter, useTranslations } from 'next-intl';
import { deleteOpponentArchetype } from '@/app/actions/opponentArchetypes';
import {
  Button,
  Dialog,
  ErrorMessage,
  OpponentArchetypeForm,
} from '@/components';
import type { getFormat } from '@/lib/dal';
import { cn, getWinRateTint } from '@/lib/utils';
import classes from './formatPage.module.css';

type MatchStatisticsRow = Awaited<
  ReturnType<typeof getFormat>
>['matchStatistics'][number];

const OpponentArchetypeRow = ({
  row,
  username,
}: {
  row: MatchStatisticsRow;
  username: string;
}) => {
  const {
    opponentArchetypeId,
    opponentArchetype: name,
    totalMatches: matchCount,
  } = row;

  const t = useTranslations('formatOpponentArchetype');
  const tCommon = useTranslations('common');
  const formatter = useFormatter();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm(t('deleteConfirm', { name }))) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    const result = await deleteOpponentArchetype({
      opponentArchetypeId,
    });

    if (!result.success) {
      setError(result.error);
      setIsDeleting(false);
    }
  };

  return (
    <tr>
      <td>
        <Link href={`/${username}/opponents/${opponentArchetypeId}`}>
          {name}
        </Link>
        {error && <ErrorMessage error={error} className={classes.rowError} />}
      </td>
      {matchCount === 0 ? (
        <>
          <td className="text-number">{t('noMatches')}</td>
          <td className="text-number">{t('noMatches')}</td>
          <td className="text-number">{t('noMatches')}</td>
        </>
      ) : (
        <>
          <td className="text-number">
            {tCommon('matchRecord', {
              wins: row.matchWins,
              losses: row.matchLosses,
              ties: row.matchDraws,
            })}
          </td>
          <td className="text-number">
            {tCommon('gameRecord', { wins: row.wins, losses: row.losses })}
          </td>
          <td
            className={cn(
              'text-number',
              getWinRateTint({ winRate: row.winRate, matchCount }),
            )}
          >
            {formatter.number(row.winRate, {
              style: 'percent',
              maximumFractionDigits: 1,
            })}
          </td>
        </>
      )}
      <td>
        <div className={classes.rowActions}>
          <Button
            variant="secondary"
            size="small"
            onClick={() => setIsDialogOpen(true)}
          >
            {t('edit')}
          </Button>
          {/* Archetypes with matches can't be deleted; the format page
              explains why in a hint above the table */}
          <Button
            variant="danger"
            size="small"
            onClick={handleDelete}
            disabled={isDeleting || matchCount > 0}
          >
            {isDeleting ? t('deleting') : t('delete')}
          </Button>
        </div>
        <Dialog isOpen={isDialogOpen} title={t('editTitle')} usePortal>
          <OpponentArchetypeForm
            mode="edit"
            opponentArchetypeId={opponentArchetypeId}
            initialName={name}
            onSuccess={() => {
              setIsDialogOpen(false);
              router.refresh();
            }}
            onCancel={() => setIsDialogOpen(false)}
          />
        </Dialog>
      </td>
    </tr>
  );
};

export default OpponentArchetypeRow;
