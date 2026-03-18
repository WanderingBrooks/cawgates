import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getUserArchetypes } from '@/app/actions/archetypes';
import { Button, Card, CardTitle, PageTitle } from '@/components';

const ArchetypesPage = async () => {
  const t = await getTranslations('archetypes');

  const archetypes = await getUserArchetypes();

  return (
    <>
      <PageTitle title={t('title')} showLogout />
      <Link href="/archetypes/create">
        <Button variant="primary">{t('createArchetype')}</Button>
      </Link>

      {archetypes.length === 0 ? (
        <p>{t('noArchetypes')}</p>
      ) : (
        archetypes.map(archetype => (
          <Link key={archetype.id} href={`/archetypes/${archetype.id}`}>
            <Card>
              <CardTitle>
                <h2>{archetype.name}</h2>
                <span>
                  {t('eventCount', { count: archetype._count.events })}
                </span>
              </CardTitle>
            </Card>
          </Link>
        ))
      )}
    </>
  );
};

export default ArchetypesPage;
