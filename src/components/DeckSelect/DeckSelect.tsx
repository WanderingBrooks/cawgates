'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { getUserDecks } from '@/app/actions/decks';
import DeckForm from '../DeckForm';
import ItemPicker from '../ItemPicker';

type DeckSelectProps = {
  label?: string;
  id?: string;
  name: string;
  value: string;
  onChange: (deckId: string) => void;
  required?: boolean;
};

// No Edit button: decks are edited from their Matchups page
const DeckSelect = (props: DeckSelectProps) => {
  const t = useTranslations('deckSelect');

  const loadOptions = useCallback(() => getUserDecks(), []);

  return (
    <ItemPicker
      {...props}
      loadOptions={loadOptions}
      text={{
        placeholder: t('selectDeck'),
        empty: t('empty'),
        loading: t('loading'),
        add: t('add'),
        createTitle: t('createTitle'),
      }}
      renderCreateForm={({ onSuccess, onCancel }) => (
        <DeckForm mode="create" onSuccess={onSuccess} onCancel={onCancel} />
      )}
    />
  );
};

export default DeckSelect;
