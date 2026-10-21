'use client';

import { useEffect, useState } from 'react';
import Dialog from '../Dialog';
import Button from '../Button';
import classes from './itemPicker.module.css';

type ItemOption = {
  id: string;
  name: string;
  // Listed after the others, under text.secondaryGroup
  isSecondary?: boolean;
};

type FormRenderProps = {
  onSuccess: (data: ItemOption) => void;
  onCancel: () => void;
};

type ItemPickerProps = {
  label?: string;
  hint?: string;
  id?: string;
  name: string;
  value: string;
  onChange: (id: string) => void;
  // A locked picker can't change its value, though the selected item can
  // still be renamed
  isLocked?: boolean;
  required?: boolean;
  // Must be stable (useCallback), since a new function reloads the options
  loadOptions: () => Promise<ItemOption[]>;
  text: {
    placeholder: string;
    // Shown in the disabled dropdown until the first item is added
    empty: string;
    loading: string;
    add: string;
    createTitle: string;
    // Heading for the options marked isSecondary
    secondaryGroup?: string;
  };
  renderCreateForm: (props: FormRenderProps) => React.ReactNode;
  // Leave out to hide the Edit button
  edit?: {
    label: string;
    title: string;
    renderForm: (
      props: FormRenderProps & { option: ItemOption },
    ) => React.ReactNode;
  };
};

// Matches the order loadOptions returns, so new and renamed items land
// where a reload would put them
const sortOptions = ({ options }: { options: ItemOption[] }) =>
  [...options].sort((a, b) => {
    if (Boolean(a.isSecondary) !== Boolean(b.isSecondary)) {
      return a.isSecondary ? 1 : -1;
    }

    return a.name.localeCompare(b.name);
  });

const renderOptions = ({ options }: { options: ItemOption[] }) =>
  options.map(option => (
    <option key={option.id} value={option.id}>
      {option.name}
    </option>
  ));

/**
 * A dropdown of named items (decks, formats, opponent archetypes) with
 * "+ Add" and Edit buttons next to it, each opening a dialog with the item's
 * form.
 * A new item is selected as soon as it's created.
 */
const ItemPicker = ({
  label,
  hint,
  id,
  name,
  value,
  onChange,
  isLocked = false,
  required,
  loadOptions,
  text,
  renderCreateForm,
  edit,
}: ItemPickerProps) => {
  const [options, setOptions] = useState<ItemOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await loadOptions();

      setOptions(
        data.map(o => ({ id: o.id, name: o.name, isSecondary: o.isSecondary })),
      );

      setIsLoading(false);
    };

    load();
  }, [loadOptions]);

  const selectedOption = options.find(o => o.id === value) ?? null;

  const primaryOptions = options.filter(o => !o.isSecondary);
  const secondaryOptions = options.filter(o => o.isSecondary);

  // Nothing to pick yet, so + Add is the only next step
  const isEmpty = !isLoading && options.length === 0;

  let placeholder = text.placeholder;

  if (isLoading) {
    placeholder = text.loading;
  } else if (isEmpty) {
    placeholder = text.empty;
  }

  const handleCreateSuccess = (data: ItemOption) => {
    setOptions(prev => sortOptions({ options: [...prev, data] }));
    onChange(data.id);
    setIsCreateOpen(false);
  };

  const handleEditSuccess = (data: ItemOption) => {
    setOptions(prev =>
      sortOptions({ options: prev.map(o => (o.id === data.id ? data : o)) }),
    );

    setIsEditOpen(false);
  };

  return (
    <div className={classes.container}>
      {label && <label htmlFor={id}>{label}</label>}
      {hint && <span className="hint">{hint}</span>}
      {/* Hidden input carries the form value, since a disabled <select> is
          not submitted at all */}
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
          onChange={e => onChange(e.target.value)}
          required={required}
          disabled={isLoading || isLocked || isEmpty}
          className={classes.select}
        >
          <option value="">{placeholder}</option>
          {renderOptions({ options: primaryOptions })}
          {secondaryOptions.length > 0 && (
            <optgroup label={text.secondaryGroup}>
              {renderOptions({ options: secondaryOptions })}
            </optgroup>
          )}
        </select>
        {!isLocked && (
          <Button
            type="button"
            variant={isEmpty ? 'primary' : 'secondary'}
            onClick={() => setIsCreateOpen(true)}
            disabled={isLoading}
          >
            {text.add}
          </Button>
        )}
        {edit && selectedOption && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsEditOpen(true)}
          >
            {edit.label}
          </Button>
        )}
      </div>

      <Dialog isOpen={isCreateOpen} title={text.createTitle} usePortal>
        {renderCreateForm({
          onSuccess: handleCreateSuccess,
          onCancel: () => setIsCreateOpen(false),
        })}
      </Dialog>

      {edit && selectedOption && (
        <Dialog isOpen={isEditOpen} title={edit.title} usePortal>
          {edit.renderForm({
            option: selectedOption,
            onSuccess: handleEditSuccess,
            onCancel: () => setIsEditOpen(false),
          })}
        </Dialog>
      )}
    </div>
  );
};

export default ItemPicker;
