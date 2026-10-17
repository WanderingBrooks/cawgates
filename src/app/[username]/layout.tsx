import { PageContent, SiteHeader } from '@/components';
import { getOwnerByUsername } from '@/lib/dal';

const UsernameLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;

  const { isOwner, viewer } = await getOwnerByUsername({ username });

  return (
    <>
      <SiteHeader
        ownerUsername={username}
        isOwner={isOwner}
        viewerUsername={viewer?.username ?? null}
      />
      <PageContent>{children}</PageContent>
    </>
  );
};

export default UsernameLayout;
