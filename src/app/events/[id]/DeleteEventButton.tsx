'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { deleteEventAndMatches } from '@/app/actions/events';
import { Button, ErrorMessage } from '@/components';

const DeleteEventButton = ({ eventId }: { eventId: string }) => {
  const t = useTranslations('deleteEventButton');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm(t('deleteConfirm'))) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    const result = await deleteEventAndMatches(eventId);

    if (result && !result.success) {
      setError(result.error || 'Failed to delete event');
      setIsDeleting(false);
    }
  };

  return (
    <>
      {error && <ErrorMessage error={error} />}
      <Button onClick={handleDelete} disabled={isDeleting} variant="secondary">
        {isDeleting ? t('deleting') : t('delete')}
      </Button>
    </>
  );
};

export default DeleteEventButton;
