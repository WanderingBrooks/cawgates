'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button, Dialog, OpponentArchetypeForm } from '@/components';
import DeleteOpponentArchetypeButton from './DeleteOpponentArchetypeButton';

const OpponentArchetypeActions = ({
  opponentArchetypeId,
  formatId,
  initialName,
  username,
  isOwner,
  deckSlug,
  hasMatches,
}: {
  opponentArchetypeId: string;
  formatId: string;
  initialName: string;
  username: string;
  isOwner: boolean;
  // Carried back to the format page so it keeps the same deck filter
  deckSlug: string | null;
  // Any match blocks deleting, whatever the deck filter shows
  hasMatches: boolean;
}) => {
  const t = useTranslations('opponentArchetypePage');
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Link
        href={`/${username}/matchups/${formatId}${
          deckSlug ? `?deck=${encodeURIComponent(deckSlug)}` : ''
        }`}
      >
        <Button variant="secondary">{t('viewMatchups')}</Button>
      </Link>
      {isOwner && (
        <Button variant="secondary" onClick={() => setIsDialogOpen(true)}>
          {t('edit')}
        </Button>
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
            deleteButton={
              <DeleteOpponentArchetypeButton
                opponentArchetypeId={opponentArchetypeId}
                name={initialName}
                hasMatches={hasMatches}
              />
            }
            deleteHint={hasMatches ? t('hasMatchesHint') : undefined}
          />
        </Dialog>
      )}
    </>
  );
};

export default OpponentArchetypeActions;
