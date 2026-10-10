'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { deleteUnusedOpponentArchetypes } from '@/app/actions/formats';
import { Button, ErrorMessage } from '@/components';
import classes from './formatPage.module.css';

const DeleteUnusedOpponentArchetypesButton = ({
  formatId,
  count,
}: {
  formatId: string;
  count: number;
}) => {
  const t = useTranslations('deleteUnusedOpponentArchetypesButton');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm(t('deleteConfirm', { count }))) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    const result = await deleteUnusedOpponentArchetypes({ formatId });

    if (!result.success) {
      setError(result.error);
    }

    setIsDeleting(false);
  };

  return (
    <>
      {error && <ErrorMessage error={error} />}
      <div className={classes.rightAlignedButton}>
        <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? t('deleting') : t('delete', { count })}
        </Button>
      </div>
    </>
  );
};

export default DeleteUnusedOpponentArchetypesButton;
