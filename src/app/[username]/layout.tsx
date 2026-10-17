import { PageContent, SiteHeader } from '@/components';
import { getFormatsForOwner, getOwnerByUsername } from '@/lib/dal';

const UsernameLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;

  const [{ isOwner, viewer }, { formats }] = await Promise.all([
    getOwnerByUsername({ username }),
    getFormatsForOwner({ ownerUsername: username }),
  ]);

  return (
    <>
      <SiteHeader
        ownerUsername={username}
        isOwner={isOwner}
        mostPlayedFormatId={formats[0]?.id}
        viewerUsername={viewer?.username ?? null}
      />
      <PageContent>{children}</PageContent>
    </>
  );
};

export default UsernameLayout;
