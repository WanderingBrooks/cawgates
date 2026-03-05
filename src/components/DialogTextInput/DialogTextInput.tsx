'use client';

import classes from './dialogTextInput.module.css';
import TextArea, { TextAreaProps } from '../TextArea';
import { Card, CardTitle } from '../Card';
import { useState } from 'react';
import Button from '../Button';
import { cn } from '@/lib/utils';

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
      <div className={cn(classes.dialogContainer, isOpen && classes.open)}>
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
    </>
  );
};

export default DialogTextInput;
