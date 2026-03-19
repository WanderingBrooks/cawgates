'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { deleteOpponentArchetype } from '@/app/actions/opponentArchetypes';
import { Button, ErrorMessage } from '@/components';

const DeleteOpponentArchetypeButton = ({
  opponentArchetypeId,
}: {
  opponentArchetypeId: string;
}) => {
  const t = useTranslations('deleteOpponentArchetypeButton');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm(t('deleteConfirm'))) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    const result = await deleteOpponentArchetype({ opponentArchetypeId });

    if (result && !result.success) {
      setError(result.error || t('hasMatches'));
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

export default DeleteOpponentArchetypeButton;
