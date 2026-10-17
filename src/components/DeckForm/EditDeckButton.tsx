'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { type SavedDeck } from '@/lib/types';
import Button from '../Button';
import Dialog from '../Dialog';
import DeckForm from './DeckForm';

// Opens the deck form in a dialog, with Delete deck in its button row
const EditDeckButton = ({
  username,
  label,
  deck,
  isFormatLocked,
}: {
  username: string;
  label: string;
  deck: SavedDeck;
  // A deck with matches can't move to another format
  isFormatLocked: boolean;
}) => {
  const t = useTranslations('editDeck');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // The slug or format may have changed, so go to the saved deck's URL
  const handleSuccess = (saved: SavedDeck) => {
    setIsOpen(false);

    router.push(
      `/${username}/matchups/${saved.formatId}?deck=${encodeURIComponent(saved.slug)}`,
    );
  };

  const handleDeleted = () => {
    setIsOpen(false);
    router.push(`/${username}/matchups/${deck.formatId}`);
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        {label}
      </Button>
      <Dialog isOpen={isOpen} title={t('title')} usePortal>
        {/* Only rendered while open, so a cancelled edit starts over */}
        {isOpen && (
          <DeckForm
            mode="edit"
            deckId={deck.id}
            initialDeckData={deck}
            isFormatLocked={isFormatLocked}
            onSuccess={handleSuccess}
            onCancel={() => setIsOpen(false)}
            onDeleted={handleDeleted}
          />
        )}
      </Dialog>
    </>
  );
};

export default EditDeckButton;
