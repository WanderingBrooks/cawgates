import { getTranslations } from 'next-intl/server';
import { PageTitle } from '@/components';
import { getArchetypeForUser } from '@/lib/dal';
import ArchetypeForm from '../../ArchetypeForm';

const EditArchetypePage = async ({
  params,
}: {
  params: Promise<{ archetypeId: string }>;
}) => {
  const t = await getTranslations('editArchetype');
  const { archetypeId } = await params;

  const { archetype } = await getArchetypeForUser({ archetypeId });

  return (
    <>
      <PageTitle title={t('title')} />
      <ArchetypeForm
        mode="edit"
        archetypeId={archetypeId}
        initialName={archetype.name}
      />
    </>
  );
};

export default EditArchetypePage;
