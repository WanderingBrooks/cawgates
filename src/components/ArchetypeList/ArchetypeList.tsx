'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { getOpponentArchetypesForArchetype } from '@/app/actions/opponentArchetypes';
import { createOpponentArchetypeInline } from '@/app/actions/opponentArchetypes';
import classes from './archetypeList.module.css';
import { cn } from '@/lib/utils';
import { Button, Input } from '../';

type OpponentArchetypeOption = {
  id: string;
  name: string;
};

type ArchetypeListProps = {
  archetypeId: string;
  label?: string;
  id?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
};

const ArchetypeList = ({
  archetypeId,
  className = '',
  label,
  id,
  name,
  value,
  onChange,
  required,
}: ArchetypeListProps) => {
  const t = useTranslations('archetypeList');
  const ADD_NEW_VALUE = '__ADD_NEW__';

  const [options, setOptions] = useState<OpponentArchetypeOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const loadArchetypes = async () => {
      const data = await getOpponentArchetypesForArchetype({ archetypeId });

      setOptions(data);
      setIsLoading(false);

      // If the current value is not in the loaded options and is non-empty,
      // switch to add-new mode so the user can see/edit what they typed.
      if (value && !data.some(o => o.id === value)) {
        setIsAddingNew(true);
      }
    };

    loadArchetypes();
    // value is intentionally excluded — we only want this to run when archetypeId changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archetypeId]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === ADD_NEW_VALUE) {
      setIsAddingNew(true);
      setNewName('');

      const syntheticEvent = {
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    } else {
      const syntheticEvent = {
        target: { value: e.target.value },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    }
  };

  const handleNewNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const handleAddNew = async () => {
    if (!newName.trim()) return;

    const result = await createOpponentArchetypeInline({
      archetypeId,
      name: newName.trim(),
    });

    if ('error' in result) {
      return;
    }

    const created = { id: result.id, name: newName.trim() };

    setOptions(prev => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    setIsAddingNew(false);
    setNewName('');

    const syntheticEvent = {
      target: { value: created.id },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setNewName('');

    const syntheticEvent = {
      target: { value: '' },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
  };

  return (
    <div className={classes.inputContainer}>
      {label && <label htmlFor={id}>{label}</label>}
      {/* Hidden input carries the selected opponentArchetypeId for form submission */}
      <input type="hidden" id={id} name={name} value={value} required={required} />
      {isAddingNew ? (
        <div className={classes.createNewItemContainer}>
          <Input
            type="text"
            value={newName}
            onChange={handleNewNameChange}
            className={className}
            placeholder={t('enterNewArchetype')}
          />
          <Button type="button" onClick={handleAddNew} variant="primary">
            {t('addNew')}
          </Button>
          <Button type="button" onClick={handleCancel} variant="secondary">
            {t('cancel')}
          </Button>
        </div>
      ) : (
        <select
          value={value}
          onChange={handleSelectChange}
          required={required}
          disabled={isLoading}
          className={cn(classes.select, className)}
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
      )}
    </div>
  );
};

export default ArchetypeList;
