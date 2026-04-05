import { getTranslations } from 'next-intl/server';
import { PageTitle } from '@/components';
import { getArchetypeForUser } from '@/lib/dal';
import ArchetypeForm from '../../ArchetypeForm';

const EditArchetypePage = async ({
  params,
}: {
  params: Promise<{ username: string; archetypeSlug: string }>;
}) => {
  const t = await getTranslations('editArchetype');
  const { username, archetypeSlug } = await params;

  const { archetype } = await getArchetypeForUser({ archetypeSlug });

  return (
    <>
      <PageTitle title={t('title')} subtitle={archetype.name} />
      <ArchetypeForm
        mode="edit"
        username={username}
        archetypeId={archetype.id}
        archetypeSlug={archetype.slug}
        initialName={archetype.name}
        initialSlug={archetype.slug}
      />
    </>
  );
};

export default EditArchetypePage;
