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
        empty: t('empty'),
        loading: t('loading'),
        add: t('add'),
        createTitle: t('createTitle'),
      }}
      renderCreateForm={({ onSuccess, onCancel }) => (
        <FormatForm mode="create" onSuccess={onSuccess} onCancel={onCancel} />
      )}
      edit={{
        label: t('edit'),
        title: t('editTitle'),
        renderForm: ({ option, onSuccess, onCancel }) => (
          <FormatForm
            mode="edit"
            formatId={option.id}
            initialName={option.name}
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        ),
      }}
    />
  );
};

export default FormatSelect;
