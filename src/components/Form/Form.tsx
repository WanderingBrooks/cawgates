'use client';

import { useEffect, useState } from 'react';
import classes from './form.module.css';

// TODO: Revisit how forms protect against lost work. The beforeunload
// warning below misses links and Back, and iPhone Safari never shows it, so
// an accidental reload there (pull to refresh) loses the form, notes and
// all. The plan is drafts: save each form to localStorage as the user types,
// restore it when the form opens again, and clear it on save. Confirming on
// links and Back was tried in PR #84 and taken out as too fragile.

type FormProps = {
  action: (formData: FormData) => void;
  children: React.ReactNode;
  /**
   * When true, warns the user if they attempt to leave the page with unsaved
   * changes. Defaults to true.
   *
   * Uses the browser's `beforeunload` event, which only fires for full-page
   * navigations: reload, closing the tab, or typing a new URL. It does NOT
   * fire for in-app navigation (back button, <Link> clicks) because Next.js
   * handles those in JavaScript without unloading the document.
   *
   * Set to false for forms where losing input is not a concern (e.g. login).
   */
  warnIfUnsaved?: boolean;
};

const Form = ({ action, children, warnIfUnsaved = true }: FormProps) => {
  const [hasFormDataChanged, setHasFormDataChanged] = useState(false);

  useEffect(() => {
    if (!hasFormDataChanged || !warnIfUnsaved) {
      return;
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasFormDataChanged, warnIfUnsaved]);

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
