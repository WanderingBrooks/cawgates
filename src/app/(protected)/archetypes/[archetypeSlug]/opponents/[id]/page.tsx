import { getTranslations } from 'next-intl/server';
import { PageTitle } from '@/components';
import { getOpponentArchetypeForUser } from '@/lib/dal';
import { cn } from '@/lib/utils';
import DeleteOpponentArchetypeButton from './DeleteOpponentArchetypeButton';
import OpponentArchetypeEditSection from './OpponentArchetypeEditSection';
import classes from './opponentArchetypePage.module.css';

const OpponentArchetypePage = async ({
  params,
}: {
  params: Promise<{ archetypeSlug: string; id: string }>;
}) => {
  const { archetypeSlug, id } = await params;
  const t = await getTranslations('opponentArchetypePage');

  const { archetype, opponentArchetype } = await getOpponentArchetypeForUser({
    archetypeSlug,
    opponentArchetypeId: id,
  });

  return (
    <>
      <PageTitle title={opponentArchetype.name} subtitle={archetype.name} />
      <p className={cn('text-label', classes.sectionHeader)}>{t('editSection')}</p>
      <OpponentArchetypeEditSection
        archetypeId={archetype.id}
        opponentArchetypeId={opponentArchetype.id}
        initialName={opponentArchetype.name}
      />
      <p className={cn('text-label', classes.sectionHeader)}>{t('dangerZone')}</p>
      <DeleteOpponentArchetypeButton opponentArchetypeId={opponentArchetype.id} />
    </>
  );
};

export default OpponentArchetypePage;
