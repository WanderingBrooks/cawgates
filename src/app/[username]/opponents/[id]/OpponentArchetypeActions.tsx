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
  isOwner,
  deckSlug,
}: {
  opponentArchetypeId: string;
  formatId: string;
  initialName: string;
  username: string;
  isOwner: boolean;
  // Carried back to the format page so it keeps the same deck filter
  deckSlug: string | null;
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
      <Link
        href={`/${username}/formats/${formatId}${
          deckSlug ? `?deck=${encodeURIComponent(deckSlug)}` : ''
        }`}
      >
        <Button variant="secondary">{t('viewFormat')}</Button>
      </Link>
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
