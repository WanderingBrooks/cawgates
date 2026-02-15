'use client';

import { useTranslations } from 'next-intl';
import { logout } from '@/app/actions/auth';
import Button from '../Button';
import classes from './header.module.css';

type HeaderProps = {
  username: string;
};

const Header = ({ username }: HeaderProps) => {
  const t = useTranslations('header');

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <span className={classes.welcome}>
          {t('welcomeUser', { username })}
        </span>
        <Button onClick={handleLogout}>{t('logout')}</Button>
      </div>
    </header>
  );
};

export default Header;
