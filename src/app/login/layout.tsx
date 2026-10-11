import { PageContent, SiteHeader } from '@/components';

const LoginLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <SiteHeader viewerUsername={null} />
    <PageContent>{children}</PageContent>
  </>
);

export default LoginLayout;
