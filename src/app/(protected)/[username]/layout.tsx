import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

const UsernameLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;

  const owner = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!owner) {
    notFound();
  }

  return <>{children}</>;
};

export default UsernameLayout;
