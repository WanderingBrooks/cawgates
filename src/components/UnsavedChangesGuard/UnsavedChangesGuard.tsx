'use client';

import { useEffect } from 'react';

// Shared by every dirty form on the page, so a dialog's form inside another
// form still asks only once
let dirtyFormCount = 0;
let confirmMessage = '';
let isUndoingBack = false;

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  e.preventDefault();
};

// Next.js <Link>s navigate in JavaScript, so beforeunload never fires for
// them. This runs on window in the capture phase, before React sees the click.
const handleClick = (e: MouseEvent) => {
  // Modified clicks open a new tab and leave this one alone
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
    return;
  }

  const link = e.target instanceof Element ? e.target.closest('a[href]') : null;

  if (!(link instanceof HTMLAnchorElement) || link.target === '_blank') {
    return;
  }

  if (!window.confirm(confirmMessage)) {
    e.preventDefault();
    e.stopPropagation();
  }
};

// Back (the button or a swipe) can't be cancelled, only undone. When the user
// stays, this stops Next.js from seeing the Back and goes forward again, so
// the page and the form are left untouched. Assumes Back: Forward onto a
// dirty form isn't possible, since the form would have been left first.
const handlePopState = (e: PopStateEvent) => {
  if (isUndoingBack) {
    isUndoingBack = false;
    e.stopImmediatePropagation();

    return;
  }

  if (dirtyFormCount > 0 && !window.confirm(confirmMessage)) {
    e.stopImmediatePropagation();
    isUndoingBack = true;
    window.history.go(1);
  }
};

// Window listeners run in the order they were added, and Next.js adds its
// popstate listener when the app mounts. Adding this one as the module loads
// (imported by the root layout) puts it first, so it can stop Next.js's.
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', handlePopState);
}

const addGuard = ({ message }: { message: string }) => {
  confirmMessage = message;
  dirtyFormCount += 1;

  if (dirtyFormCount === 1) {
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('click', handleClick, { capture: true });
  }
};

const removeGuard = () => {
  dirtyFormCount -= 1;

  if (dirtyFormCount === 0) {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    window.removeEventListener('click', handleClick, { capture: true });
  }
};

/**
 * While isDirty, asks before leaving the page by reload, closing the tab,
 * a link (including the menu) or Back. Saving and Cancel navigate in code,
 * so they're not asked about here.
 */
const useUnsavedChangesGuard = ({
  isDirty,
  message,
}: {
  isDirty: boolean;
  message: string;
}) => {
  useEffect(() => {
    if (!isDirty) {
      return;
    }

    addGuard({ message });

    return removeGuard;
  }, [isDirty, message]);
};

/**
 * Renders nothing. The root layout renders it so this module loads before
 * the app mounts; see the popstate listener above.
 */
const UnsavedChangesGuard = () => null;

export { useUnsavedChangesGuard };
export default UnsavedChangesGuard;
