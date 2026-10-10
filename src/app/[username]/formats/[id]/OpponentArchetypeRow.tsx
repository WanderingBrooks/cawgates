'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { deleteOpponentArchetypeFromFormat } from '@/app/actions/opponentArchetypes';
import {
  Button,
  Card,
  CardContent,
  CardTitle,
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

    const result = await deleteOpponentArchetypeFromFormat({
      opponentArchetypeId,
    });

    if (!result.success) {
      setError(result.error);
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardTitle>
        <span>{name}</span>
        <span>{t('matchCount', { count: matchCount })}</span>
      </CardTitle>
      <CardContent>
        {error && <ErrorMessage error={error} />}
        <div className={classes.rowActions}>
          <Button variant="secondary" onClick={() => setIsDialogOpen(true)}>
            {t('rename')}
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={isDeleting || matchCount > 0}
          >
            {isDeleting ? t('deleting') : t('delete')}
          </Button>
        </div>
      </CardContent>
      <Dialog isOpen={isDialogOpen} title={t('renameTitle')} usePortal>
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
    </Card>
  );
};

export default OpponentArchetypeRow;
