import { getTranslations } from 'next-intl/server';
import { PageTitle } from '@/components';
import { getArchetypeForUser } from '@/lib/dal';
import EventForm from '../EventForm';

const CreateEventPage = async ({
  params,
}: {
  params: Promise<{ username: string; archetypeSlug: string }>;
}) => {
  const t = await getTranslations('createEvent');
  const { username, archetypeSlug } = await params;

  const { archetype } = await getArchetypeForUser({ archetypeSlug });

  return (
    <>
      <PageTitle title={t('title')} subtitle={archetype.name} />
      <EventForm
        mode="create"
        username={username}
        archetypeId={archetype.id}
        archetypeSlug={archetype.slug}
      />
    </>
  );
};

export default CreateEventPage;
