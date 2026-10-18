'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { type SavedDeck } from '@/lib/types';
import Button from '../Button';
import Dialog from '../Dialog';
import DeckForm from './DeckForm';

// Opens the deck form in a dialog, then the new deck's matchups
const CreateDeckButton = ({
  username,
  label,
  initialFormatId,
}: {
  username: string;
  label: string;
  initialFormatId?: string;
}) => {
  const t = useTranslations('createDeck');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = (deck: SavedDeck) => {
    setIsOpen(false);

    router.push(
      `/${username}/matchups/${deck.formatId}?deck=${encodeURIComponent(deck.slug)}`,
    );
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        {label}
      </Button>
      <Dialog isOpen={isOpen} title={t('title')} usePortal>
        {/* Only rendered while open, so it starts empty every time */}
        {isOpen && (
          <DeckForm
            mode="create"
            initialFormatId={initialFormatId}
            onSuccess={handleSuccess}
            onCancel={() => setIsOpen(false)}
          />
        )}
      </Dialog>
    </>
  );
};

export default CreateDeckButton;
