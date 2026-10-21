'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { getOpponentArchetypesForArchetype } from '@/app/actions/opponentArchetypes';
import { type OpponentArchetypeOption } from '@/lib/types';
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

// Rogue archetypes are the picker's secondary group
const toItemOption = ({ id, name, isRogue }: OpponentArchetypeOption) => ({
  id,
  name,
  isSecondary: isRogue,
});

const OpponentArchetypeSelect = ({
  deckId,
  ...props
}: OpponentArchetypeSelectProps) => {
  const t = useTranslations('opponentArchetypeSelect');

  const loadOptions = useCallback(async () => {
    const opponentArchetypes = await getOpponentArchetypesForArchetype({
      deckId,
    });

    return opponentArchetypes.map(toItemOption);
  }, [deckId]);

  return (
    <ItemPicker
      {...props}
      loadOptions={loadOptions}
      text={{
        placeholder: t('selectArchetype'),
        empty: t('empty'),
        loading: t('loading'),
        add: t('add'),
        createTitle: t('createTitle'),
        secondaryGroup: t('rogueGroup'),
      }}
      renderCreateForm={({ onSuccess, onCancel }) => (
        <OpponentArchetypeForm
          mode="create"
          deckId={deckId}
          onSuccess={data => onSuccess(toItemOption(data))}
          onCancel={onCancel}
        />
      )}
      edit={{
        label: t('edit'),
        title: t('editTitle'),
        renderForm: ({ option, onSuccess, onCancel }) => (
          <OpponentArchetypeForm
            mode="edit"
            opponentArchetypeId={option.id}
            initialName={option.name}
            initialIsRogue={Boolean(option.isSecondary)}
            onSuccess={data => onSuccess(toItemOption(data))}
            onCancel={onCancel}
          />
        ),
      }}
    />
  );
};

export default OpponentArchetypeSelect;
