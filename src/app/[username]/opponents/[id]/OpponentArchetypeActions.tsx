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
  username,
}: {
  opponentArchetypeId: string;
  formatId: string;
  initialName: string;
  username: string;
}) => {
  const t = useTranslations('opponentArchetypePage');
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setIsDialogOpen(true)}>
        {t('edit')}
      </Button>
      <Link href={`/${username}/formats/${formatId}`}>
        <Button variant="secondary">{t('viewFormat')}</Button>
      </Link>
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
    </>
  );
};

export default OpponentArchetypeActions;
