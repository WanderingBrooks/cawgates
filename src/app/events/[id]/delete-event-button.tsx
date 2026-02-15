'use client';

import { useTranslations } from 'next-intl';
import { deleteEventAndMatches } from '@/app/actions/events';
import Button from '@/components/button';

const DeleteEventButton = ({ eventId }: { eventId: string }) => {
  const t = useTranslations('events');

  const handleDelete = async () => {
    if (confirm(t('deleteConfirm'))) {
      await deleteEventAndMatches(eventId);
    }
  };

  return <Button onClick={handleDelete}>{t('delete')}</Button>;
};

export default DeleteEventButton;
