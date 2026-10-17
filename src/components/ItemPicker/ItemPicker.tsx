'use client';

import { useEffect, useState } from 'react';
import Dialog from '../Dialog';
import Button from '../Button';
import classes from './itemPicker.module.css';

type ItemOption = {
  id: string;
  name: string;
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
    loading: string;
    add: string;
    edit: string;
    createTitle: string;
    editTitle: string;
  };
  renderCreateForm: (props: FormRenderProps) => React.ReactNode;
  renderEditForm: (
    props: FormRenderProps & { option: ItemOption },
  ) => React.ReactNode;
};

const sortByName = (options: ItemOption[]) =>
  [...options].sort((a, b) => a.name.localeCompare(b.name));

/**
 * A dropdown of named items (formats, opponent archetypes) with "+ Add" and
 * Edit buttons next to it, each opening a dialog with the item's name form.
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
  renderEditForm,
}: ItemPickerProps) => {
  const [options, setOptions] = useState<ItemOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await loadOptions();

      setOptions(data.map(o => ({ id: o.id, name: o.name })));
      setIsLoading(false);
    };

    load();
  }, [loadOptions]);

  const selectedOption = options.find(o => o.id === value) ?? null;

  const handleCreateSuccess = (data: ItemOption) => {
    setOptions(prev => sortByName([...prev, data]));
    onChange(data.id);
    setIsCreateOpen(false);
  };

  const handleEditSuccess = (data: ItemOption) => {
    setOptions(prev =>
      sortByName(prev.map(o => (o.id === data.id ? data : o))),
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
          disabled={isLoading || isLocked}
          className={classes.select}
        >
          <option value="">
            {isLoading ? text.loading : text.placeholder}
          </option>
          {options.map(option => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        {!isLocked && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsCreateOpen(true)}
            disabled={isLoading}
          >
            {text.add}
          </Button>
        )}
        {selectedOption && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsEditOpen(true)}
          >
            {text.edit}
          </Button>
        )}
      </div>

      <Dialog isOpen={isCreateOpen} title={text.createTitle} usePortal>
        {renderCreateForm({
          onSuccess: handleCreateSuccess,
          onCancel: () => setIsCreateOpen(false),
        })}
      </Dialog>

      {selectedOption && (
        <Dialog isOpen={isEditOpen} title={text.editTitle} usePortal>
          {renderEditForm({
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
