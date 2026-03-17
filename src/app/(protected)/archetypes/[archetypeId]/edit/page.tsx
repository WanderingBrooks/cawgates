import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { PageTitle } from '@/components';
import ArchetypeForm from '../../ArchetypeForm';

const EditArchetypePage = async ({
  params,
}: {
  params: Promise<{ archetypeId: string }>;
}) => {
  const t = await getTranslations('editArchetype');
  const user = await getUser();

  if (!user) {
    return null; // Middleware will redirect
  }

  const { archetypeId } = await params;

  const archetype = await prisma.archetype.findUnique({
    where: { id: archetypeId },
  });

  if (!archetype || archetype.userId !== user.userId) {
    notFound();
  }

  return (
    <>
      <PageTitle title={t('title')} showLogout />
      <ArchetypeForm
        mode="edit"
        archetypeId={archetypeId}
        initialName={archetype.name}
      />
    </>
  );
};

export default EditArchetypePage;
