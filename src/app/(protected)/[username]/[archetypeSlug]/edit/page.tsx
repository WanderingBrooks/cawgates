import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { PageTitle } from '@/components';
import { getArchetype } from '@/lib/dal';
import ArchetypeForm from '../../ArchetypeForm';

const EditArchetypePage = async ({
  params,
}: {
  params: Promise<{ username: string; archetypeSlug: string }>;
}) => {
  const t = await getTranslations('editArchetype');
  const { username, archetypeSlug } = await params;

  const { archetype, isOwner } = await getArchetype({
    ownerUsername: username,
    archetypeSlug,
  });

  if (!isOwner) {
    notFound();
  }

  return (
    <>
      <PageTitle title={t('title')} subtitle={archetype.name} />
      <ArchetypeForm
        mode="edit"
        username={username}
        archetypeId={archetype.id}
        archetypeSlug={archetype.slug}
        initialArchetypeData={archetype}
      />
    </>
  );
};

export default EditArchetypePage;
