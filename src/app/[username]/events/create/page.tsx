import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { PageTitle } from '@/components';
import { getArchetypesForOwner } from '@/lib/dal';
import EventForm from '../EventForm';
import Link from 'next/link';

const CreateEventPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const t = await getTranslations('createEvent');
  const { username } = await params;

  const { archetypes, isOwner } = await getArchetypesForOwner({ ownerUsername: username });

  if (!isOwner) {
    notFound();
  }

  return (
    <>
      <PageTitle title={t('title')} />
      {archetypes.length === 0 ? (
        <p>
          <Link href={`/${username}/archetypes/create`}>{t('createArchetypeFirst')}</Link>
        </p>
      ) : (
        <EventForm
          mode="create"
          username={username}
          archetypes={archetypes.map(a => ({ id: a.id, name: a.name }))}
        />
      )}
    </>
  );
};

export default CreateEventPage;
