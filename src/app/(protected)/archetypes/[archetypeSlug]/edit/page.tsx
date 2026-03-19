import { getTranslations } from 'next-intl/server';
import { PageTitle } from '@/components';
import { getArchetypeForUser } from '@/lib/dal';
import ArchetypeForm from '../../ArchetypeForm';

const EditArchetypePage = async ({
  params,
}: {
  params: Promise<{ archetypeSlug: string }>;
}) => {
  const t = await getTranslations('editArchetype');
  const { archetypeSlug } = await params;

  const { archetype } = await getArchetypeForUser({ archetypeSlug });

  return (
    <>
      <PageTitle title={t('title')} subtitle={archetype.name} />
      <ArchetypeForm
        mode="edit"
        archetypeId={archetype.id}
        archetypeSlug={archetype.slug}
        initialName={archetype.name}
        initialSlug={archetype.slug}
      />
    </>
  );
};

export default EditArchetypePage;
