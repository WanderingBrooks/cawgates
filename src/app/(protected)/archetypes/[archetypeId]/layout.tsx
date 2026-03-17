import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/session';

const ArchetypeLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ archetypeId: string }>;
}) => {
  const user = await getUser();

  if (!user) {
    return null; // Protected layout handles redirect
  }

  const { archetypeId } = await params;

  const archetype = await prisma.archetype.findUnique({
    where: { id: archetypeId },
  });

  if (!archetype || archetype.userId !== user.userId) {
    notFound();
  }

  return <>{children}</>;
};

export default ArchetypeLayout;
