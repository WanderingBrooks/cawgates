'use client';

import { useState } from 'react';
import classes from './datalist-input.module.css';
import { cn } from '@/lib/utils';
import Button from '../button';
import Input from '../input';

type DatalistInputProps = {
  label?: string;
  options: string[];
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
};

const DatalistInput = ({
  className = '',
  label,
  options,
  id,
  value,
  onChange,
  required,
}: DatalistInputProps) => {
  const ADD_NEW_VALUE = '__ADD_NEW__';

  const [isAddingNew, setIsAddingNew] = useState(
    !options.includes(value) && value !== '',
  );

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

  return (
    <div className={classes.inputContainer}>
      {label && <label htmlFor={id}>{label}</label>}
      {isAddingNew ? (
        <div className={classes.createNewItemContainer}>
          <Input
            type="text"
            id={id}
            value={value}
            onChange={onChange}
            required={required}
            className={className}
            placeholder="Enter new archetype..."
          />
          <Button
            type="button"
            onClick={() => {
              setIsAddingNew(false);

              const syntheticEvent = {
                target: { value: '' },
              } as React.ChangeEvent<HTMLInputElement>;

              onChange(syntheticEvent);
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <select
          id={id}
          value={value}
          onChange={handleSelectChange}
          required={required}
          className={cn(classes.select, className)}
        >
          <option value="">Select an archetype...</option>
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          <option value={ADD_NEW_VALUE}>+ Add New...</option>
        </select>
      )}
    </div>
  );
};

export default DatalistInput;
