import { PageTitle } from '@/components';
import { getTranslations } from 'next-intl/server';

/**
 * Loading component to be shown when a page is loading.
 */
const Loading = async () => {
  const t = await getTranslations('loader');

  return (
    <>
      <PageTitle title={t('title')} />
    </>
  );
};

export default Loading;
