'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { deleteOpponentArchetype } from '@/app/actions/opponentArchetypes';
import { Button, ErrorMessage } from '@/components';

const DeleteOpponentArchetypeButton = ({
  opponentArchetypeId,
  hasMatches,
}: {
  opponentArchetypeId: string;
  hasMatches: boolean;
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
      setError(result.error);
      setIsDeleting(false);
    }
  };

  return (
    <>
      {error && <ErrorMessage error={error} />}
      <Button
        onClick={handleDelete}
        disabled={isDeleting || hasMatches}
        variant="danger"
      >
        {isDeleting ? t('deleting') : t('delete')}
      </Button>
      {hasMatches && <p>{t('hasMatchesHint')}</p>}
    </>
  );
};

export default DeleteOpponentArchetypeButton;
