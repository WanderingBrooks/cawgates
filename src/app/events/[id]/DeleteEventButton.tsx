'use client';

import { useTranslations } from 'next-intl';
import { deleteEventAndMatches } from '@/app/actions/events';
import { Button } from '@/components';

const DeleteEventButton = ({ eventId }: { eventId: string }) => {
  const t = useTranslations('deleteEventButton');

  const handleDelete = async () => {
    if (confirm(t('deleteConfirm'))) {
      await deleteEventAndMatches(eventId);
    }
  };

  return <Button onClick={handleDelete}>{t('delete')}</Button>;
};

export default DeleteEventButton;
