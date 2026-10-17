import { PageContent, SiteHeader } from '@/components';

const RegisterLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <SiteHeader viewerUsername={null} />
    <PageContent>{children}</PageContent>
  </>
);

export default RegisterLayout;
