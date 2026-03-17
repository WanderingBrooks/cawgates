import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/session';
import { MatchTable, PageTitle, Button } from '@/components';
import getMatchStatistics from './getMatchStatistics';
import DeleteArchetypeButton from './DeleteArchetypeButton';

const ArchetypePage = async ({
  params,
}: {
  params: Promise<{ archetypeId: string }>;
}) => {
  const user = await getUser();

  if (!user) {
    return null; // Middleware will redirect
  }

  const { archetypeId } = await params;
  const t = await getTranslations('archetypePage');

  const archetype = await prisma.archetype.findUnique({
    where: { id: archetypeId },
  });

  if (!archetype || archetype.userId !== user.userId) {
    notFound();
  }

  const matchStatistics = await getMatchStatistics({ archetypeId });

  return (
    <>
      <PageTitle title={archetype.name} showLogout />

      <Link href={`/archetypes/${archetypeId}/events`}>
        <Button variant="primary">{t('viewEvents')}</Button>
      </Link>

      <MatchTable rows={matchStatistics} />

      <DeleteArchetypeButton archetypeId={archetypeId} />
    </>
  );
};

export default ArchetypePage;
