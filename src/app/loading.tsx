import { Loading, PageContent } from '@/components';

// Root-level routes have no layout of their own to supply PageContent
const RootLoading = () => (
  <PageContent>
    <Loading />
  </PageContent>
);

export default RootLoading;
