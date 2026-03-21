'use client';

import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { Card, CardTitle } from '../Card';
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
      <Card className={cn(classes.dialog, className)}>
        <CardTitle>{title}</CardTitle>
        {children}
      </Card>
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
