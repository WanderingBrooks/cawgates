import { getOwnerByUsername } from '@/lib/dal';
import { GuestBanner } from '@/components';
import { ViewerProvider } from '@/components/NavMenu/ViewerContext';

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
    <ViewerProvider
      isOwner={isOwner}
      isLoggedIn={viewer !== null}
      viewerUsername={viewer?.username ?? null}
    >
      {!isOwner && (
        <GuestBanner
          ownerUsername={username}
          viewer={viewer ? { username: viewer.username } : null}
        />
      )}
      {children}
    </ViewerProvider>
  );
};

export default UsernameLayout;
