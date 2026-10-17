'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { type SavedDeck } from '@/lib/types';
import Button from '../Button';
import Dialog from '../Dialog';
import DeckForm from './DeckForm';

/**
 * Opens the deck form in a dialog. Once the deck is created it opens the
 * deck's matchups, or with stayOnPage reloads the current page, like the
 * event pages that need a deck before they can show anything.
 */
const CreateDeckButton = ({
  username,
  label,
  variant = 'primary',
  initialFormatId,
  stayOnPage = false,
}: {
  username: string;
  label: string;
  variant?: 'primary' | 'secondary';
  initialFormatId?: string;
  stayOnPage?: boolean;
}) => {
  const t = useTranslations('createDeck');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = (deck: SavedDeck) => {
    setIsOpen(false);

    if (stayOnPage) {
      router.refresh();
      return;
    }

    router.push(
      `/${username}/matchups/${deck.formatId}?deck=${encodeURIComponent(deck.slug)}`,
    );
  };

  return (
    <>
      <Button variant={variant} onClick={() => setIsOpen(true)}>
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
