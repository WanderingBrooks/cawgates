'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { deleteEvent } from '@/app/actions/events';
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

    const result = await deleteEvent(eventId);

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

export default DeleteEventButton;
