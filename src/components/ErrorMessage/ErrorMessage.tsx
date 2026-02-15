'use client';

import { useTranslations } from 'next-intl';
import classes from './errorMessage.module.css';
import { cn } from '@/lib/utils';

type ErrorMessageProps = {
  error: string;
  className?: string;
};

const ErrorMessage = ({ error, className }: ErrorMessageProps) => {
  const t = useTranslations('errorMessage');

  return (
    <div className={cn(classes.error, className)}>
      {t.rich('message', {
        error,
        strong: chunks => <strong>{chunks}</strong>,
      })}
    </div>
  );
};

export default ErrorMessage;
