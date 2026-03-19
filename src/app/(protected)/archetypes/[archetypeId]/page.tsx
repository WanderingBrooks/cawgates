import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { MatchTable, PageTitle, Button, FlexRowBetween } from '@/components';
import { getArchetypeForUser } from '@/lib/dal';
import getMatchStatistics from './getMatchStatistics';
import DeleteArchetypeButton from './DeleteArchetypeButton';

const ArchetypePage = async ({
  params,
}: {
  params: Promise<{ archetypeId: string }>;
}) => {
  const { archetypeId } = await params;
  const t = await getTranslations('archetypePage');

  const { archetype } = await getArchetypeForUser({ archetypeId });

  const matchStatistics = await getMatchStatistics({ archetypeId });

  return (
    <>
      <PageTitle title={t('title', { archetype: archetype.name })} />

      <MatchTable rows={matchStatistics} />

      <FlexRowBetween>
        <Link href={`/archetypes/${archetypeId}/edit`}>
          <Button variant="primary">{t('edit')}</Button>
        </Link>
        <DeleteArchetypeButton archetypeId={archetypeId} />
      </FlexRowBetween>
    </>
  );
};

export default ArchetypePage;
