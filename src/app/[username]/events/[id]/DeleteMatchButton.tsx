'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { deleteMatch } from '@/app/actions/matches';
import { Button, ErrorMessage } from '@/components';

const DeleteMatchButton = ({
  matchId,
  onDeleted,
}: {
  matchId: string;
  // Closes the edit dialog the button sits in
  onDeleted: () => void;
}) => {
  const t = useTranslations('deleteMatchButton');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm(t('deleteConfirm'))) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    const result = await deleteMatch(matchId);

    if (result && !result.success) {
      setError(result.error);
      setIsDeleting(false);
      return;
    }

    onDeleted();
  };

  return (
    <>
      <Button onClick={handleDelete} disabled={isDeleting} variant="danger">
        {isDeleting ? t('deleting') : t('delete')}
      </Button>
      {error && <ErrorMessage error={error} />}
    </>
  );
};

export default DeleteMatchButton;
