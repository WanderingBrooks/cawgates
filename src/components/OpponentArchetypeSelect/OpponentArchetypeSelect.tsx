'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { getOpponentArchetypesForArchetype } from '@/app/actions/opponentArchetypes';
import ItemPicker from '../ItemPicker';
import OpponentArchetypeForm from '../OpponentArchetypeForm';

type OpponentArchetypeSelectProps = {
  deckId: string;
  label?: string;
  id?: string;
  name: string;
  value: string;
  onChange: (opponentArchetypeId: string) => void;
  required?: boolean;
};

const OpponentArchetypeSelect = ({
  deckId,
  ...props
}: OpponentArchetypeSelectProps) => {
  const t = useTranslations('opponentArchetypeSelect');

  const loadOptions = useCallback(
    () => getOpponentArchetypesForArchetype({ deckId }),
    [deckId],
  );

  return (
    <ItemPicker
      {...props}
      loadOptions={loadOptions}
      text={{
        placeholder: t('selectArchetype'),
        empty: t('empty'),
        loading: t('loading'),
        add: t('add'),
        edit: t('edit'),
        createTitle: t('createTitle'),
        editTitle: t('editTitle'),
      }}
      renderCreateForm={({ onSuccess, onCancel }) => (
        <OpponentArchetypeForm
          mode="create"
          deckId={deckId}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      )}
      renderEditForm={({ option, onSuccess, onCancel }) => (
        <OpponentArchetypeForm
          mode="edit"
          opponentArchetypeId={option.id}
          initialName={option.name}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      )}
    />
  );
};

export default OpponentArchetypeSelect;
