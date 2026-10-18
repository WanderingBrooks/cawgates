'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useUnsavedChangesGuard } from '../UnsavedChangesGuard';
import classes from './form.module.css';

type FormProps = {
  action: (formData: FormData) => void;
  children: React.ReactNode;
  /**
   * When true, asks before the user leaves the page with unsaved changes:
   * reload, closing the tab, a link or Back. Defaults to true.
   *
   * Set to false for forms where losing input is not a concern (e.g. login).
   */
  warnIfUnsaved?: boolean;
};

const Form = ({ action, children, warnIfUnsaved = true }: FormProps) => {
  const t = useTranslations('discardConfirm');
  const [hasFormDataChanged, setHasFormDataChanged] = useState(false);

  useUnsavedChangesGuard({
    isDirty: hasFormDataChanged && warnIfUnsaved,
    message: t('message'),
  });

  return (
    // eslint-disable-next-line no-restricted-syntax
    <form
      action={action}
      onChange={() => setHasFormDataChanged(true)}
      className={classes.form}
    >
      {children}
    </form>
  );
};

export default Form;
