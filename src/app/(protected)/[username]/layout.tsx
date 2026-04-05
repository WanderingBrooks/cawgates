import { notFound } from 'next/navigation';
import { getUser } from '@/lib/session';

const UsernameLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) => {
  const [user, { username }] = await Promise.all([getUser(), params]);

  if (!user || user.username !== username) {
    notFound();
  }

  return <>{children}</>;
};

export default UsernameLayout;
