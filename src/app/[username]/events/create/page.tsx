import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { PageTitle } from '@/components';
import { getOwnerByUsername } from '@/lib/dal';
import EventForm from '../EventForm';

const CreateEventPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const t = await getTranslations('createEvent');
  const { username } = await params;

  const { isOwner } = await getOwnerByUsername({ username });

  if (!isOwner) {
    notFound();
  }

  return (
    <>
      <PageTitle title={t('title')} />
      <EventForm mode="create" username={username} />
    </>
  );
};

export default CreateEventPage;
