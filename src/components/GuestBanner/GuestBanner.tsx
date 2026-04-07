import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent } from '@/components';
import classes from './guestBanner.module.css';

type GuestBannerProps = {
  ownerUsername: string;
  viewer: { username: string } | null;
};

const GuestBanner = async ({ ownerUsername, viewer }: GuestBannerProps) => {
  const t = await getTranslations('guestBanner');

  return (
    <Card className={classes.guestBanner}>
      <CardContent direction="horizontal" className={classes.guestBannerContent}>
        <p>{t('viewing', { username: ownerUsername })}</p>
        {viewer ? (
          <Link href={`/${viewer.username}`}>{t('backToMyDecks')}</Link>
        ) : (
          <p>
            <Link href="/login">{t('login')}</Link>
            {t('or')}
            <Link href="/register">{t('register')}</Link>
            {t('loggedOut')}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default GuestBanner;
