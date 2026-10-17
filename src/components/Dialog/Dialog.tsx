'use client';

import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import classes from './dialog.module.css';

type DialogProps = {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  className?: string;
  usePortal?: boolean;
};

// useSyncExternalStore with a no-op subscribe is the React 18 idiomatic way
// to detect client-side rendering without setState-in-effect.
const subscribe = () => () => {};

const useIsClient = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

const Dialog = ({
  isOpen,
  title,
  children,
  className,
  usePortal = false,
}: DialogProps) => {
  const isClient = useIsClient();

  const content = (
    <div className={cn(classes.dialogContainer, isOpen && classes.open)}>
      <div className={cn(classes.dialog, className)}>
        <div className={classes.header}>
          <h2>{title}</h2>
        </div>
        {/* Children only mount while open, so forms inside start fresh each time
            instead of keeping state (e.g. a typed name) from the last open */}
        <div className={classes.body}>{isOpen && children}</div>
      </div>
    </div>
  );

  if (usePortal) {
    if (!isClient) {
      return null;
    }

    return createPortal(content, document.body);
  }

  return content;
};

export default Dialog;
