import { getTranslations } from 'next-intl/server';
import { PageTitle } from '@/components';
import ArchetypeForm from '../ArchetypeForm';

const CreateArchetypePage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const t = await getTranslations('createArchetype');

  return (
    <>
      <PageTitle title={t('title')} />
      <ArchetypeForm mode="create" username={username} />
    </>
  );
};

export default CreateArchetypePage;
