'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { getUserFormats } from '@/app/actions/formats';
import Dialog from '../Dialog';
import Button from '../Button';
import FormatForm from '../FormatForm';
import classes from './formatSelect.module.css';

type FormatOption = {
  id: string;
  name: string;
};

type FormatSelectProps = {
  label?: string;
  hint?: string;
  id?: string;
  name: string;
  value: string;
  onChange: (formatId: string) => void;
  isLocked?: boolean;
  required?: boolean;
};

const ADD_NEW_VALUE = '__ADD_NEW__';

const FormatSelect = ({
  label,
  hint,
  id,
  name,
  value,
  onChange,
  isLocked = false,
  required,
}: FormatSelectProps) => {
  const t = useTranslations('formatSelect');

  const [options, setOptions] = useState<FormatOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      const data = await getUserFormats();

      setOptions(data.map(o => ({ id: o.id, name: o.name })));
      setIsLoading(false);
    };

    loadOptions();
  }, []);

  const selectedOption = options.find(o => o.id === value) ?? null;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === ADD_NEW_VALUE) {
      setIsCreateOpen(true);
      return;
    }

    onChange(e.target.value);
  };

  const handleCreateSuccess = (data: FormatOption) => {
    setOptions(prev =>
      [...prev, data].sort((a, b) => a.name.localeCompare(b.name)),
    );

    onChange(data.id);
    setIsCreateOpen(false);
  };

  const handleEditSuccess = (data: FormatOption) => {
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
      {hint && <span className="hint">{hint}</span>}
      {/* Hidden input carries the clean form value — the visible <select> may hold the
          sentinel "__ADD_NEW__" value, and a disabled <select> is not submitted at all */}
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
          disabled={isLoading || isLocked}
          className={classes.select}
        >
          <option value="">
            {isLoading ? t('loading') : t('selectFormat')}
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
        <FormatForm
          mode="create"
          onSuccess={handleCreateSuccess}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Dialog>

      {selectedOption && (
        <Dialog isOpen={isEditOpen} title={t('editTitle')} usePortal>
          <FormatForm
            mode="edit"
            formatId={selectedOption.id}
            initialName={selectedOption.name}
            onSuccess={handleEditSuccess}
            onCancel={() => setIsEditOpen(false)}
          />
        </Dialog>
      )}
    </div>
  );
};

export default FormatSelect;
