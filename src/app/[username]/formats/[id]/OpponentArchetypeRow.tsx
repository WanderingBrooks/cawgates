'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { deleteOpponentArchetype } from '@/app/actions/opponentArchetypes';
import {
  Button,
  Dialog,
  ErrorMessage,
  OpponentArchetypeForm,
} from '@/components';
import classes from './formatPage.module.css';

const OpponentArchetypeRow = ({
  opponentArchetypeId,
  name,
  matchCount,
}: {
  opponentArchetypeId: string;
  name: string;
  matchCount: number;
}) => {
  const t = useTranslations('formatOpponentArchetype');
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
        {name}
        {error && <ErrorMessage error={error} className={classes.rowError} />}
      </td>
      <td className="text-number">{matchCount}</td>
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
