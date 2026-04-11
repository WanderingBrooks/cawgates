'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { deleteDeck } from '@/app/actions/decks';
import { Button, ErrorMessage } from '@/components';

const DeleteDeckButton = ({ deckId }: { deckId: string }) => {
  const t = useTranslations('deleteDeckButton');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm(t('deleteConfirm'))) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    const result = await deleteDeck(deckId);

    if (result && !result.success) {
      setError(result.error);
      setIsDeleting(false);
    }
  };

  return (
    <>
      {error && <ErrorMessage error={error} />}
      <Button onClick={handleDelete} disabled={isDeleting} variant="danger">
        {isDeleting ? t('deleting') : t('delete')}
      </Button>
    </>
  );
};

export default DeleteDeckButton;
