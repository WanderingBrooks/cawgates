import { getTranslations } from 'next-intl/server';
import { PageTitle } from '@/components';
import { getArchetypeForUser } from '@/lib/dal';
import EventForm from '../EventForm';

const CreateEventPage = async ({
  params,
}: {
  params: Promise<{ archetypeSlug: string }>;
}) => {
  const t = await getTranslations('createEvent');
  const { archetypeSlug } = await params;

  const { archetype } = await getArchetypeForUser({ archetypeSlug });

  return (
    <>
      <PageTitle title={t('title')} subtitle={archetype.name} />
      <EventForm
        mode="create"
        archetypeId={archetype.id}
        archetypeSlug={archetype.slug}
      />
    </>
  );
};

export default CreateEventPage;
