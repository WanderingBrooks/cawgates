import { getTranslations } from 'next-intl/server';
import { PageTitle } from '@/components';
import { getArchetypeForUser } from '@/lib/dal';
import OpponentArchetypeForm from '../OpponentArchetypeForm';

const CreateOpponentArchetypePage = async ({
  params,
}: {
  params: Promise<{ archetypeSlug: string }>;
}) => {
  const t = await getTranslations('createOpponentArchetype');
  const { archetypeSlug } = await params;

  const { archetype } = await getArchetypeForUser({ archetypeSlug });

  return (
    <>
      <PageTitle title={t('title')} subtitle={archetype.name} />
      <OpponentArchetypeForm
        mode="create"
        archetypeId={archetype.id}
        archetypeSlug={archetype.slug}
      />
    </>
  );
};

export default CreateOpponentArchetypePage;
