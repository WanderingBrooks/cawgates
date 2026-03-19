import { PageTitle } from '@/components';
import { getTranslations } from 'next-intl/server';

/**
 * Loading component to be shown when a page is loading.
 */
const Loading = async () => {
  const t = await getTranslations('loading');

  return (
    <>
      <PageTitle title={t('title')} disableMenu />
    </>
  );
};

export default Loading;
