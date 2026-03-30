'use client';

import { useEffect, useState } from 'react';

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
    <form action={action} onChange={() => setHasFormDataChanged(true)}>
      {children}
    </form>
  );
};

export default Form;
