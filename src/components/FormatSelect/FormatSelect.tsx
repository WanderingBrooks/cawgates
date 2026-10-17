'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { getUserFormats } from '@/app/actions/formats';
import FormatForm from '../FormatForm';
import ItemPicker from '../ItemPicker';

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

const FormatSelect = (props: FormatSelectProps) => {
  const t = useTranslations('formatSelect');

  const loadOptions = useCallback(() => getUserFormats(), []);

  return (
    <ItemPicker
      {...props}
      loadOptions={loadOptions}
      text={{
        placeholder: t('selectFormat'),
        loading: t('loading'),
        add: t('add'),
        edit: t('edit'),
        createTitle: t('createTitle'),
        editTitle: t('editTitle'),
      }}
      renderCreateForm={({ onSuccess, onCancel }) => (
        <FormatForm mode="create" onSuccess={onSuccess} onCancel={onCancel} />
      )}
      renderEditForm={({ option, onSuccess, onCancel }) => (
        <FormatForm
          mode="edit"
          formatId={option.id}
          initialName={option.name}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      )}
    />
  );
};

export default FormatSelect;
