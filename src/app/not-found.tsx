import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import classes from './not-found.module.css';

const NotFound = async () => {
  const t = await getTranslations('notFound');

  return (
    <div className={classes.container}>
      <div className={classes.inner}>
        <h1 className={classes.code}>{t('title')}</h1>
        <div className={classes.divider} />
        <div className={classes.right}>
          <p className={classes.message}>{t('message')}</p>
          <Link href="/archetypes" className={classes.button}>
            {t('backToArchetypes')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
