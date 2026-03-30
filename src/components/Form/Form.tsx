'use client';

import { useState } from 'react';
import useWarnIfUnsaved from '@/hooks/useWarnIfUnsaved';

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
  const [isDirty, setIsDirty] = useState(false);

  useWarnIfUnsaved(isDirty && warnIfUnsaved);

  return (
    // eslint-disable-next-line no-restricted-syntax
    <form action={action} onChange={() => setIsDirty(true)}>
      {children}
    </form>
  );
};

export default Form;
