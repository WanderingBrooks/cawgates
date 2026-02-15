'use client';

import { cn } from '@/lib/utils';
import classes from './pageTitle.module.css';
import { useTranslations } from 'next-intl';
import { logout } from '@/app/actions/auth';
import Button from '../Button';

type PageTitleProps = {
  title: string;
  className?: string;
};

const PageTitle = ({ title, className }: PageTitleProps) => {
  const t = useTranslations('pageTitle');

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className={cn(classes.pageTitle, className)}>
      <h1>{title}</h1>
      <Button onClick={handleLogout} variant="secondary">
        {t('logout')}
      </Button>
    </div>
  );
};

export default PageTitle;
