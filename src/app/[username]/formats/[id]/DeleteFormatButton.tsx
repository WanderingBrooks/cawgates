'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { deleteFormat } from '@/app/actions/formats';
import { Button, ErrorMessage } from '@/components';

const DeleteFormatButton = ({
  formatId,
  deckCount,
  opponentArchetypeCount,
}: {
  formatId: string;
  deckCount: number;
  opponentArchetypeCount: number;
}) => {
  const t = useTranslations('deleteFormatButton');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasDecks = deckCount > 0;

  const handleDelete = async () => {
    const message =
      opponentArchetypeCount > 0
        ? t('deleteConfirmWithArchetypes', { count: opponentArchetypeCount })
        : t('deleteConfirm');

    if (!confirm(message)) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    const result = await deleteFormat({ formatId });

    if (result && !result.success) {
      setError(result.error);
      setIsDeleting(false);
    }
  };

  return (
    <>
      {error && <ErrorMessage error={error} />}
      <Button
        onClick={handleDelete}
        disabled={isDeleting || hasDecks}
        variant="danger"
      >
        {isDeleting ? t('deleting') : t('delete')}
      </Button>
      {hasDecks && <p>{t('hasDecksHint')}</p>}
    </>
  );
};

export default DeleteFormatButton;
