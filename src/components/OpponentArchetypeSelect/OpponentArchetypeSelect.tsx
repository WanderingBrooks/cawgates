'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { getOpponentArchetypesForArchetype } from '@/app/actions/opponentArchetypes';
import Dialog from '../Dialog';
import Button from '../Button';
import OpponentArchetypeForm from '@/components/OpponentArchetypeForm';
import classes from './opponentArchetypeSelect.module.css';

type OpponentArchetypeOption = {
  id: string;
  name: string;
};

type OpponentArchetypeSelectProps = {
  archetypeId: string;
  label?: string;
  id?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

const ADD_NEW_VALUE = '__ADD_NEW__';

const OpponentArchetypeSelect = ({
  archetypeId,
  label,
  id,
  name,
  value,
  onChange,
  required,
}: OpponentArchetypeSelectProps) => {
  const t = useTranslations('opponentArchetypeSelect');

  const [options, setOptions] = useState<OpponentArchetypeOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      const data = await getOpponentArchetypesForArchetype({ archetypeId });

      setOptions(data.map(o => ({ id: o.id, name: o.name })));
      setIsLoading(false);
    };

    loadOptions();
  }, [archetypeId]);

  const selectedOption = options.find(o => o.id === value) ?? null;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === ADD_NEW_VALUE) {
      setIsCreateOpen(true);
      return;
    }

    const syntheticEvent = {
      target: { value: e.target.value },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
  };

  const handleCreateSuccess = (data: { id: string; name: string }) => {
    setOptions(prev =>
      [...prev, data].sort((a, b) => a.name.localeCompare(b.name)),
    );

    const syntheticEvent = {
      target: { value: data.id },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
    setIsCreateOpen(false);
  };

  const handleEditSuccess = (data: { id: string; name: string }) => {
    setOptions(prev =>
      prev
        .map(o => (o.id === data.id ? data : o))
        .sort((a, b) => a.name.localeCompare(b.name)),
    );

    setIsEditOpen(false);
  };

  return (
    <div className={classes.container}>
      {label && <label htmlFor={id}>{label}</label>}
      {/* Hidden input carries the selected opponentArchetypeId for form submission */}
      <input
        type="hidden"
        id={id}
        name={name}
        value={value}
        required={required}
      />
      <div className={classes.selectRow}>
        <select
          value={value}
          onChange={handleSelectChange}
          required={required}
          disabled={isLoading}
          className={classes.select}
        >
          <option value="">
            {isLoading ? t('loading') : t('selectArchetype')}
          </option>
          {options.map(option => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
          <option value={ADD_NEW_VALUE}>{t('addNew')}</option>
        </select>
        {selectedOption && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsEditOpen(true)}
          >
            {t('edit')}
          </Button>
        )}
      </div>

      <Dialog isOpen={isCreateOpen} title={t('createTitle')} usePortal>
        <OpponentArchetypeForm
          mode="create"
          archetypeId={archetypeId}
          onSuccess={handleCreateSuccess}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Dialog>

      {selectedOption && (
        <Dialog isOpen={isEditOpen} title={t('editTitle')} usePortal>
          <OpponentArchetypeForm
            mode="edit"
            archetypeId={archetypeId}
            opponentArchetypeId={selectedOption.id}
            initialName={selectedOption.name}
            onSuccess={handleEditSuccess}
            onCancel={() => setIsEditOpen(false)}
          />
        </Dialog>
      )}
    </div>
  );
};

export default OpponentArchetypeSelect;
