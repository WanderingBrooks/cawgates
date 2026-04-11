import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getArchetypesForOwner } from '@/lib/dal';
import { Button, Card, CardTitle, PageTitle } from '@/components';
import classes from '../archetypes.module.css';

const ArchetypesPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const t = await getTranslations('archetypes');

  const { archetypes, isOwner } = await getArchetypesForOwner({ ownerUsername: username });

  return (
    <>
      <PageTitle title={isOwner ? t('title') : t('guestTitle', { username })} />
      {isOwner && (
        <div className={classes.rightAlignedButton}>
          <Link href={`/${username}/archetypes/create`}>
            <Button variant="primary">{t('createArchetype')}</Button>
          </Link>
        </div>
      )}

      {archetypes.length === 0 ? (
        <p>{t('noArchetypes')}</p>
      ) : (
        archetypes.map(archetype => (
          <Card key={archetype.id}>
            <CardTitle>
              <Link href={`/${username}/${archetype.slug}`}>
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
