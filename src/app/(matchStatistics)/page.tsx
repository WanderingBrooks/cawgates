import Link from 'next/link';

import { getTranslations } from 'next-intl/server';
import { Page, Button, MatchTable, PageTitle } from '@/components';
import getMatchStatistics from './getMatchStatistics';

const MatchStatistics = async () => {
  const t = await getTranslations('home');
  const matchStatistics = await getMatchStatistics();

  return (
    <Page>
      <PageTitle>
        <h1>{t('title')}</h1>
        <Link href="/events">
          <Button>{t('viewEvents')}</Button>
        </Link>
      </PageTitle>

      <MatchTable rows={matchStatistics} showWinRate />
    </Page>
  );
};

export default MatchStatistics;
