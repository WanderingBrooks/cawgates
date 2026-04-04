import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getUserArchetypes } from '@/app/actions/archetypes';
import { Button, Card, CardTitle, PageTitle } from '@/components';
import classes from './archetypes.module.css';

const ArchetypesPage = async () => {
  const t = await getTranslations('archetypes');

  const archetypes = await getUserArchetypes();

  return (
    <>
      <PageTitle title={t('title')} />
      <div className={classes.rightAlignedButton}>
        <Link href="/archetypes/create">
          <Button variant="primary">{t('createArchetype')}</Button>
        </Link>
      </div>

      {archetypes.length === 0 ? (
        <p>{t('noArchetypes')}</p>
      ) : (
        archetypes.map(archetype => (
          <Card key={archetype.id}>
            <CardTitle>
              <Link href={`/archetypes/${archetype.slug}`}>
                {archetype.name}
              </Link>
              <span>{t('eventCount', { count: archetype._count.events })}</span>
            </CardTitle>
          </Card>
        ))
      )}
    </>
  );
};

export default ArchetypesPage;
