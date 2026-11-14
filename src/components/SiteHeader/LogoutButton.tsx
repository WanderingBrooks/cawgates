'use client';

import { useTranslations } from 'next-intl';
import { logout } from '@/app/actions/auth';
import Button from '../Button';

const LogoutButton = ({ className }: { className?: string }) => {
  const t = useTranslations('siteHeader');

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Button onClick={handleLogout} variant="secondary" className={className}>
      {t('logout')}
    </Button>
  );
};

export default LogoutButton;
