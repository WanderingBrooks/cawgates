import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Card, CardTitle } from '@/components';
import classes from './guestBanner.module.css';

type GuestBannerProps = {
  ownerUsername: string;
  viewer: { username: string } | null;
};

const GuestBanner = async ({ ownerUsername, viewer }: GuestBannerProps) => {
  const t = await getTranslations('guestBanner');

  return (
    <Card className={classes.guestBanner}>
      <CardTitle align="center">
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
      </CardTitle>
    </Card>
  );
};

export default GuestBanner;
