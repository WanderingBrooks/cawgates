'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { getOpponentArchetypes } from '@/app/actions/archetypes';
import classes from './archetypeList.module.css';
import { cn } from '@/lib/utils';
import { Button, Input } from '../';

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

  const [archetypes, setArchetypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    const loadArchetypes = async () => {
      const data = await getOpponentArchetypes(archetypeId);

      setArchetypes(data);
      setIsLoading(false);

      // If current value is not in options and not empty, switch to add new mode
      if (value && !data.includes(value)) {
        setIsAddingNew(true);
      }
    };

    loadArchetypes();
  }, [value]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === ADD_NEW_VALUE) {
      setIsAddingNew(true);

      const syntheticEvent = {
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    } else {
      setIsAddingNew(false);

      const syntheticEvent = {
        target: { value: e.target.value },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    }
  };

  const handleCancel = () => {
    setIsAddingNew(false);

    const syntheticEvent = {
      target: { value: '' },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);
  };

  return (
    <div className={classes.inputContainer}>
      {label && <label htmlFor={id}>{label}</label>}
      {isAddingNew ? (
        <div className={classes.createNewItemContainer}>
          <Input
            type="text"
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={className}
            placeholder={t('enterNewArchetype')}
          />
          <Button type="button" onClick={handleCancel} variant="secondary">
            {t('cancel')}
          </Button>
        </div>
      ) : (
        <select
          id={id}
          name={name}
          value={value}
          onChange={handleSelectChange}
          required={required}
          disabled={isLoading}
          className={cn(classes.select, className)}
        >
          <option value="">
            {isLoading ? t('loading') : t('selectArchetype')}
          </option>
          {archetypes.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          <option value={ADD_NEW_VALUE}>{t('addNew')}</option>
        </select>
      )}
    </div>
  );
};

export default ArchetypeList;
