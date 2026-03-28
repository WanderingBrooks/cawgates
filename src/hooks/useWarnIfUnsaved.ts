'use client';

import { useEffect } from 'react';

const useWarnIfUnsaved = (isDirty: boolean) => {
  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);
};

export default useWarnIfUnsaved;
