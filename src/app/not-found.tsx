import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import classes from './not-found.module.css';
import { Button } from '@/components';
import { getUser } from '@/lib/session';

const NotFound = async () => {
  const t = await getTranslations('notFound');

  const user = await getUser();

  return (
    <div className={classes.container}>
      <p>{t('message')}</p>
      {!!user ? (
        <Link href={`/${user.username}/events`}>
          <Button variant="primary">{t('goToEvents')}</Button>
        </Link>
      ) : (
        <Link href="/login">
          <Button variant="primary">{t('goToLogin')}</Button>
        </Link>
      )}
    </div>
  );
};

export default NotFound;
