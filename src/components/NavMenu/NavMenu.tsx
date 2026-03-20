'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { logout } from '@/app/actions/auth';
import classes from './navMenu.module.css';
import { cn } from '@/lib/utils';
import Button from '../Button';

type NavMenuProps = {
  disabled?: boolean;
  archetypeName?: string;
};

const NavMenu = ({ disabled = false, archetypeName }: NavMenuProps) => {
  const t = useTranslations('navMenu');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const segments = pathname.split('/').filter(Boolean);
  const archetypesIndex = segments.indexOf('archetypes');

  const potentialSlug =
    archetypesIndex >= 0 ? segments[archetypesIndex + 1] : undefined;

  const archetypeSlug =
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
          <Link
            href="/archetypes"
            className={cn(
              classes.item,
              pathname === '/archetypes' && classes.itemActive,
            )}
            onClick={() => setOpen(false)}
          >
            {t('archetypes')}
          </Link>

          <div className={classes.divider} />
          {archetypeName && (
            <span className={classes.groupLabel}>{archetypeName}</span>
          )}
          {archetypeSlug ? (
            <>
              <Link
                href={`/archetypes/${archetypeSlug}`}
                className={cn(
                  classes.item,
                  pathname === `/archetypes/${archetypeSlug}` &&
                    classes.itemActive,
                )}
                onClick={() => setOpen(false)}
              >
                {t('record')}
              </Link>
              <Link
                href={`/archetypes/${archetypeSlug}/events`}
                className={cn(
                  classes.item,
                  pathname.startsWith(`/archetypes/${archetypeSlug}/events`) &&
                    classes.itemActive,
                )}
                onClick={() => setOpen(false)}
              >
                {t('events')}
              </Link>
              <Link
                href={`/archetypes/${archetypeSlug}/edit`}
                className={cn(
                  classes.item,
                  pathname.startsWith(`/archetypes/${archetypeSlug}/edit`) &&
                    classes.itemActive,
                )}
                onClick={() => setOpen(false)}
              >
                {t('edit')}
              </Link>
            </>
          ) : (
            <>
              <span className={cn(classes.item, classes.itemDisabled)}>
                {t('record')}
              </span>
              <span className={cn(classes.item, classes.itemDisabled)}>
                {t('events')}
              </span>
              <span className={cn(classes.item, classes.itemDisabled)}>
                {t('edit')}
              </span>
            </>
          )}
          <div className={classes.divider} />
          <button
            type="button"
            className={cn(classes.item, classes.logoutButton)}
            onClick={handleLogout}
          >
            {t('logout')}
          </button>
        </div>
      )}
    </div>
  );
};

export default NavMenu;
