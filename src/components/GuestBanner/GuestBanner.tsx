import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Card, CardTitle } from '@/components';

type GuestBannerProps = {
  ownerUsername: string;
  viewer: { username: string } | null;
};

const GuestBanner = async ({ ownerUsername, viewer }: GuestBannerProps) => {
  const t = await getTranslations('guestBanner');

  return (
    <Card>
      <CardTitle verticalAlignment="center">
        <p>{t('viewing', { username: ownerUsername })}</p>
        {viewer ? (
          <Link href={`/${viewer.username}`}>{t('backToMyDecks')}</Link>
        ) : (
          <p>
            {t('loggedOut')}{' '}
            <Link href="/login">{t('login')}</Link>
            {' / '}
            <Link href="/register">{t('register')}</Link>
          </p>
        )}
      </CardTitle>
    </Card>
  );
};

export default GuestBanner;
