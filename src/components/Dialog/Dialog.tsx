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

const Dialog = ({ isOpen, title, children, className }: DialogProps) => {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return createPortal(
    <div className={cn(classes.dialogContainer, isOpen && classes.open)}>
      <Card className={cn(classes.dialog, className)}>
        <CardTitle>{title}</CardTitle>
        {children}
      </Card>
    </div>,
    document.body,
  );
};

export default Dialog;
