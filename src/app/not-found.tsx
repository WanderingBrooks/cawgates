import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import classes from './not-found.module.css';
import { Button } from '@/components';

const NotFound = async () => {
  const t = await getTranslations('notFound');

  return (
    <div className={classes.container}>
      <p>{t('message')}</p>
      <Link href="/archetypes">
        <Button variant="primary">{t('backToArchetypes')}</Button>
      </Link>
    </div>
  );
};

export default NotFound;
