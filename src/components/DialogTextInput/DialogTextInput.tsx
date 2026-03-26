'use client';

import classes from './dialogTextInput.module.css';
import TextArea, { TextAreaProps } from '../TextArea';
import { useState } from 'react';
import Button from '../Button';
import Dialog from '../Dialog';

type DialogTextInputProps = TextAreaProps & {
  label: string;
  openButtonLabel: string;
  closeButtonLabel: string;
};

const DialogTextInput = ({
  label,
  openButtonLabel,
  closeButtonLabel,
  ...inputProps
}: DialogTextInputProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <label htmlFor={inputProps.id}>{label}</label>
      <Button onClick={() => setIsOpen(true)} variant="secondary">
        {openButtonLabel}
      </Button>
      <Dialog isOpen={isOpen} title={label} className={classes.tallDialog} usePortal={false}>
        <TextArea
          {...inputProps}
          className={classes.textArea}
          containerClassName={classes.textAreaContainer}
        />
        <Button onClick={() => setIsOpen(false)} variant="primary">
          {closeButtonLabel}
        </Button>
      </Dialog>
    </>
  );
};

export default DialogTextInput;
