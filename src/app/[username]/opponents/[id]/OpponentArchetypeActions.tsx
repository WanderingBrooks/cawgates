'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button, Dialog, OpponentArchetypeForm } from '@/components';

const OpponentArchetypeActions = ({
  opponentArchetypeId,
  formatId,
  initialName,
  isOwner,
  username,
}: {
  opponentArchetypeId: string;
  formatId: string;
  initialName: string;
  isOwner: boolean;
  username: string;
}) => {
  const t = useTranslations('opponentArchetypePage');
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      {isOwner && (
        <Button variant="secondary" onClick={() => setIsDialogOpen(true)}>
          {t('edit')}
        </Button>
      )}
      {isOwner && (
        <Link href={`/${username}/formats/${formatId}`}>
          <Button variant="secondary">{t('viewFormat')}</Button>
        </Link>
      )}
      {isOwner && (
        <Dialog isOpen={isDialogOpen} title={t('editTitle')} usePortal>
          <OpponentArchetypeForm
            mode="edit"
            opponentArchetypeId={opponentArchetypeId}
            initialName={initialName}
            onSuccess={() => {
              setIsDialogOpen(false);
              router.refresh();
            }}
            onCancel={() => setIsDialogOpen(false)}
          />
        </Dialog>
      )}
    </>
  );
};

export default OpponentArchetypeActions;
