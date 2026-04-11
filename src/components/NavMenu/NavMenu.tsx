'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { logout } from '@/app/actions/auth';
import classes from './navMenu.module.css';
import { cn } from '@/lib/utils';
import Button from '../Button';
import { useViewer } from './ViewerContext';

type NavMenuProps = {
  disabled?: boolean;
  deckName?: string;
};

const NavMenu = ({ disabled = false, deckName }: NavMenuProps) => {
  const t = useTranslations('navMenu');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isOwner, isLoggedIn, viewerUsername } = useViewer();

  const segments = pathname.split('/').filter(Boolean);
  const username = segments[0];

  const potentialSlug = segments.length > 1 ? segments[1] : undefined;

  const deckSlug =
    potentialSlug && potentialSlug !== 'create' ? potentialSlug : undefined;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
  };

  return (
    <div ref={menuRef} className={classes.container}>
      <Button
        variant="secondary"
        onClick={() => setOpen(prev => !prev)}
        disabled={disabled}
        type="button"
      >
        {t('menu')}
      </Button>
      {open && (
        <div className={classes.dropdown}>
          {viewerUsername !== null && (
            <Link
              href={`/${viewerUsername}`}
              className={cn(
                classes.item,
                pathname === `/${viewerUsername}` && classes.itemActive,
              )}
              onClick={() => setOpen(false)}
            >
              {t('myArchetypes')}
            </Link>
          )}
          {!isOwner && (
            <Link
              href={`/${username}`}
              className={cn(
                classes.item,
                pathname === `/${username}` && classes.itemActive,
              )}
              onClick={() => setOpen(false)}
            >
              {t('archetypes', { username })}
            </Link>
          )}

          {(viewerUsername !== null || !isOwner) && (
            <div className={classes.divider} />
          )}
          {deckName && (
            <span className={classes.groupLabel}>{deckName}</span>
          )}
          {deckSlug ? (
            <>
              <Link
                href={`/${username}/${deckSlug}`}
                className={cn(
                  classes.item,
                  pathname === `/${username}/${deckSlug}` &&
                    classes.itemActive,
                )}
                onClick={() => setOpen(false)}
              >
                {t('record')}
              </Link>
              <Link
                href={`/${username}/${deckSlug}/events`}
                className={cn(
                  classes.item,
                  pathname.startsWith(`/${username}/${deckSlug}/events`) &&
                    classes.itemActive,
                )}
                onClick={() => setOpen(false)}
              >
                {t('events')}
              </Link>
              {isOwner && (
                <Link
                  href={`/${username}/${deckSlug}/edit`}
                  className={cn(
                    classes.item,
                    pathname.startsWith(`/${username}/${deckSlug}/edit`) &&
                      classes.itemActive,
                  )}
                  onClick={() => setOpen(false)}
                >
                  {t('edit')}
                </Link>
              )}
            </>
          ) : (
            <>
              <span className={cn(classes.item, classes.itemDisabled)}>
                {t('record')}
              </span>
              <span className={cn(classes.item, classes.itemDisabled)}>
                {t('events')}
              </span>
              {isOwner && (
                <span className={cn(classes.item, classes.itemDisabled)}>
                  {t('edit')}
                </span>
              )}
            </>
          )}
          {isLoggedIn && (
            <>
              <div className={classes.divider} />
              <button
                type="button"
                className={cn(classes.item, classes.logoutButton)}
                onClick={handleLogout}
              >
                {t('logout')}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NavMenu;
