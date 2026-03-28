'use client';

import { useState } from 'react';
import useWarnIfUnsaved from '@/hooks/useWarnIfUnsaved';

type FormProps = {
  action: (formData: FormData) => void;
  children: React.ReactNode;
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
