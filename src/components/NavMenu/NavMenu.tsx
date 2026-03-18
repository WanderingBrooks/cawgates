'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { logout } from '@/app/actions/auth';
import classes from './navMenu.module.css';
import { cn } from '@/lib/utils';

type NavMenuProps = {
  disabled?: boolean;
};

const NavMenu = ({ disabled = false }: NavMenuProps) => {
  const t = useTranslations('navMenu');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const segments = pathname.split('/').filter(Boolean);
  const archetypesIndex = segments.indexOf('archetypes');

  const potentialId =
    archetypesIndex >= 0 ? segments[archetypesIndex + 1] : undefined;

  const archetypeId =
    potentialId && potentialId !== 'create' ? potentialId : undefined;

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
      <button
        className={classes.trigger}
        onClick={() => setOpen(prev => !prev)}
        disabled={disabled}
        type="button"
      >
        {t('menu')}
      </button>
      {open && (
        <ul className={classes.dropdown}>
          <li>
            <Link
              href="/archetypes"
              className={classes.item}
              onClick={() => setOpen(false)}
            >
              {t('archetypes')}
            </Link>
          </li>
          <li>
            {archetypeId ? (
              <Link
                href={`/archetypes/${archetypeId}/events`}
                className={classes.item}
                onClick={() => setOpen(false)}
              >
                {t('events')}
              </Link>
            ) : (
              <span className={cn(classes.item, classes.itemDisabled)}>
                {t('events')}
              </span>
            )}
          </li>
          <li>
            {archetypeId ? (
              <Link
                href={`/archetypes/${archetypeId}`}
                className={classes.item}
                onClick={() => setOpen(false)}
              >
                {t('matchStatistics')}
              </Link>
            ) : (
              <span className={cn(classes.item, classes.itemDisabled)}>
                {t('matchStatistics')}
              </span>
            )}
          </li>
          <li className={classes.logoutItem}>
            <button
              type="button"
              className={cn(classes.item, classes.logoutButton)}
              onClick={handleLogout}
            >
              {t('logout')}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default NavMenu;
