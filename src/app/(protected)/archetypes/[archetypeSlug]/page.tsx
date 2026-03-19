import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { RecordTable, PageTitle, Button, FlexRowBetween } from '@/components';
import { getArchetypeForUser } from '@/lib/dal';
import getMatchStatistics from './getMatchStatistics';
import DeleteArchetypeButton from './DeleteArchetypeButton';

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

      <FlexRowBetween>
        <Link href={`/archetypes/${archetype.slug}/edit`}>
          <Button variant="primary">{t('edit')}</Button>
        </Link>
        <DeleteArchetypeButton archetypeId={archetype.id} />
      </FlexRowBetween>
    </>
  );
};

export default ArchetypePage;
