'use client';

import classes from './dialogTextInput.module.css';
import TextArea, { TextAreaProps } from '../TextArea';
import { Card, CardTitle } from '../Card';
import { useState } from 'react';
import Button from '../Button';

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
      {label && <label htmlFor={inputProps.id}>{label}</label>}
      <Button onClick={() => setIsOpen(true)} variant="secondary">
        {openButtonLabel}
      </Button>

      {/*
        The textarea needs to stay in the DOM even when the dialog is
        closed so that the value is included in the form submission.
        When the dialog is hidden we render a hidden input bound to the
        same name/value pair. When open we render the visible TextArea.
      */}
      {isOpen ? (
        <div className={classes.dialogContainer}>
          <Card className={classes.dialog}>
            <CardTitle>{label}</CardTitle>
            <TextArea
              {...inputProps}
              className={classes.textArea}
              containerClassName={classes.textAreaContainer}
            />
            <Button onClick={() => setIsOpen(false)} variant="primary">
              {closeButtonLabel}
            </Button>
          </Card>
        </div>
      ) : (
        <input
          type="hidden"
          name={inputProps.name}
          value={typeof inputProps.value === 'string' ? inputProps.value : ''}
        />
      )}
    </>
  );
};

export default DialogTextInput;
