'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { deleteOpponentArchetype } from '@/app/actions/opponentArchetypes';
import { Button, ErrorMessage } from '@/components';

// Archetypes with matches can't be deleted; the Edit dialog explains why in a
// hint under the button row
const DeleteOpponentArchetypeButton = ({
  opponentArchetypeId,
  name,
  hasMatches,
}: {
  opponentArchetypeId: string;
  name: string;
  hasMatches: boolean;
}) => {
  const t = useTranslations('opponentArchetypePage');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm(t('deleteConfirm', { name }))) {
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
      <Button
        onClick={handleDelete}
        disabled={isDeleting || hasMatches}
        variant="danger"
      >
        {isDeleting ? t('deleting') : t('delete')}
      </Button>
      {error && <ErrorMessage error={error} />}
    </>
  );
};

export default DeleteOpponentArchetypeButton;
