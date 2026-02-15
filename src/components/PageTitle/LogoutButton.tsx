'use client';

import { useTranslations } from 'next-intl';
import { logout } from '@/app/actions/auth';
import Button from '../Button';

const LogoutButton = () => {
  const t = useTranslations('pageTitle');

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Button onClick={handleLogout} variant="secondary">
      {t('logout')}
    </Button>
  );
};

export default LogoutButton;
