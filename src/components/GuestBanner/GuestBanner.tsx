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
      <CardTitle>
        <p>{t('viewing', { username: ownerUsername })}</p>
        {viewer ? (
          <Link href={`/${viewer.username}/events`}>{t('backToMyEvents')}</Link>
        ) : (
          <p>
            {t.rich('signUpPrompt', {
              login: chunks => <Link href="/login">{chunks}</Link>,
              register: chunks => <Link href="/register">{chunks}</Link>,
            })}
          </p>
        )}
      </CardTitle>
    </Card>
  );
};

export default GuestBanner;
