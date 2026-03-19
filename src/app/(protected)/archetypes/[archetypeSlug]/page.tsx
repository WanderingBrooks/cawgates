import { getTranslations } from 'next-intl/server';
import { RecordTable, PageTitle } from '@/components';
import { getArchetypeForUser } from '@/lib/dal';
import getMatchStatistics from './getMatchStatistics';

const ArchetypePage = async ({
  params,
}: {
  params: Promise<{ archetypeSlug: string }>;
}) => {
  const { archetypeSlug } = await params;
  const t = await getTranslations('archetypePage');

  const { archetype } = await getArchetypeForUser({ archetypeSlug });

  const matchStatistics = await getMatchStatistics({
    archetypeId: archetype.id,
  });

  return (
    <>
      <PageTitle title={t('title')} subtitle={archetype.name} />
      <RecordTable rows={matchStatistics} />
    </>
  );
};

export default ArchetypePage;
