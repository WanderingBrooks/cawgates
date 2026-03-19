import { getTranslations } from 'next-intl/server';
import { PageTitle } from '@/components';
import { getOpponentArchetypeForUser } from '@/lib/dal';
import OpponentArchetypeForm from '../../OpponentArchetypeForm';

const EditOpponentArchetypePage = async ({
  params,
}: {
  params: Promise<{
    archetypeSlug: string;
    opponentArchetypeSlug: string;
  }>;
}) => {
  const t = await getTranslations('editOpponentArchetype');
  const { archetypeSlug, opponentArchetypeSlug } = await params;

  const { archetype, opponentArchetype } = await getOpponentArchetypeForUser({
    archetypeSlug,
    opponentArchetypeSlug,
  });

  return (
    <>
      <PageTitle title={t('title')} subtitle={opponentArchetype.name} />
      <OpponentArchetypeForm
        mode="edit"
        archetypeId={archetype.id}
        archetypeSlug={archetype.slug}
        opponentArchetypeId={opponentArchetype.id}
        opponentArchetypeSlug={opponentArchetype.slug}
        initialName={opponentArchetype.name}
        initialSlug={opponentArchetype.slug}
      />
    </>
  );
};

export default EditOpponentArchetypePage;
