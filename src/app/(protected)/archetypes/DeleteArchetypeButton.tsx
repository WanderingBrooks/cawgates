'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { deleteArchetype } from '@/app/actions/archetypes';
import { Button, ErrorMessage } from '@/components';

const DeleteArchetypeButton = ({ archetypeId }: { archetypeId: string }) => {
  const t = useTranslations('deleteArchetypeButton');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm(t('deleteConfirm'))) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    const result = await deleteArchetype(archetypeId);

    if (result && !result.success) {
      setError(result.error || 'Failed to delete archetype');
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

export default DeleteArchetypeButton;
