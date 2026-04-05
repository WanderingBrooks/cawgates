import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getUser } from '@/lib/session';
import { PageTitle } from '@/components';
import ArchetypeForm from '../ArchetypeForm';

const CreateArchetypePage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const [{ username }, user] = await Promise.all([params, getUser()]);

  if (!user || user.username !== username) {
    notFound();
  }

  const t = await getTranslations('createArchetype');

  return (
    <>
      <PageTitle title={t('title')} />
      <ArchetypeForm mode="create" username={username} />
    </>
  );
};

export default CreateArchetypePage;
