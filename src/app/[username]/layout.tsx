import { getUser } from '@/lib/session';
import { getOwnerByUsername } from '@/lib/dal';
import { GuestBanner } from '@/components';

const UsernameLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;

  const [{ owner }, viewer] = await Promise.all([
    getOwnerByUsername({ username }),
    getUser(),
  ]);

  const isOwner = viewer?.userId === owner.id;

  return (
    <>
      {!isOwner && (
        <GuestBanner
          ownerUsername={username}
          viewer={viewer ? { username: viewer.username } : null}
        />
      )}
      {children}
    </>
  );
};

export default UsernameLayout;
