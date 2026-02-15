import { getTranslations } from 'next-intl/server';
import { Page, MatchTable, PageTitle, Button } from '@/components';
import getMatchStatistics from './getMatchStatistics';
import { getUser } from '@/lib/session';
import Link from 'next/link';

const MatchStatistics = async () => {
  const user = await getUser();

  if (!user) {
    return null; // Middleware will redirect
  }

  const t = await getTranslations('home');
  const matchStatistics = await getMatchStatistics({ userId: user.userId });

  return (
    <Page>
      <PageTitle title={t('title')} />

      <Link href="/events">
        <Button>{t('viewEvents')}</Button>
      </Link>
      <MatchTable rows={matchStatistics} showWinRate />
    </Page>
  );
};

export default MatchStatistics;
