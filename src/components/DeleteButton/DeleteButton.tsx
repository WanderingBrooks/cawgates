'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { type ActionResult } from '@/lib/types';
import Button from '../Button';
import ErrorMessage from '../ErrorMessage';

/**
 * The Delete button in an edit form's button row. It confirms, runs the
 * delete action, and shows the action's error under the button. Actions that
 * redirect on success never return, so onDeleted is only for ones that don't.
 */
const DeleteButton = ({
  label,
  confirmMessage,
  onDelete,
  onDeleted,
  disabled = false,
}: {
  label: string;
  confirmMessage: string;
  onDelete: () => Promise<ActionResult>;
  onDeleted?: () => void;
  // Like when matches block deleting; the form's hint explains why
  disabled?: boolean;
}) => {
  const t = useTranslations('deleteButton');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm(confirmMessage)) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    const result = await onDelete();

    if (result && !result.success) {
      setError(result.error);
      setIsDeleting(false);
      return;
    }

    onDeleted?.();
  };

  return (
    <>
      <Button
        onClick={handleDelete}
        disabled={isDeleting || disabled}
        variant="danger"
      >
        {isDeleting ? t('deleting') : label}
      </Button>
      {error && <ErrorMessage error={error} />}
    </>
  );
};

export default DeleteButton;
