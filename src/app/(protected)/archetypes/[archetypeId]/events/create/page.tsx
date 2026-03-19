import { getTranslations } from 'next-intl/server';
import { PageTitle } from '@/components';
import { getArchetypeForUser } from '@/lib/dal';
import EventForm from '../EventForm';

const CreateEventPage = async ({
  params,
}: {
  params: Promise<{ archetypeId: string }>;
}) => {
  const t = await getTranslations('createEvent');
  const { archetypeId } = await params;

  const { archetype } = await getArchetypeForUser({ archetypeId });

  return (
    <>
      <PageTitle title={t('title')} subtitle={archetype.name} />
      <EventForm mode="create" archetypeId={archetypeId} />
    </>
  );
};

export default CreateEventPage;
