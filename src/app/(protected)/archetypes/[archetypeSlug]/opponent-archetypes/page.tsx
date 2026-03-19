import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Card, CardTitle, Button, PageTitle } from '@/components';
import { getOpponentArchetypesForUser } from '@/lib/dal';

const OpponentArchetypesPage = async ({
  params,
}: {
  params: Promise<{ archetypeSlug: string }>;
}) => {
  const t = await getTranslations('opponentArchetypes');
  const { archetypeSlug } = await params;

  const { archetype, opponentArchetypes } = await getOpponentArchetypesForUser({
    archetypeSlug,
  });

  return (
    <>
      <PageTitle title={t('title')} subtitle={archetype.name} />
      <Link
        href={`/archetypes/${archetype.slug}/opponent-archetypes/create`}
      >
        <Button variant="primary">{t('createOpponentArchetype')}</Button>
      </Link>

      {opponentArchetypes.length === 0 ? (
        <p>{t('noOpponentArchetypes')}</p>
      ) : (
        opponentArchetypes.map(opponentArchetype => (
          <Link
            key={opponentArchetype.id}
            href={`/archetypes/${archetype.slug}/opponent-archetypes/${opponentArchetype.slug}/edit`}
          >
            <Card>
              <CardTitle>
                <h2>{opponentArchetype.name}</h2>
                <span>{t('edit')}</span>
              </CardTitle>
            </Card>
          </Link>
        ))
      )}
    </>
  );
};

export default OpponentArchetypesPage;
