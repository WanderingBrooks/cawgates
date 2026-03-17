import { getTranslations } from 'next-intl/server';
import { getUser } from '@/lib/session';
import { PageTitle } from '@/components';
import ArchetypeForm from '../ArchetypeForm';

const CreateArchetypePage = async () => {
  const t = await getTranslations('createArchetype');
  const user = await getUser();

  if (!user) {
    return null; // Middleware will redirect
  }

  return (
    <>
      <PageTitle title={t('title')} showLogout />
      <ArchetypeForm mode="create" />
    </>
  );
};

export default CreateArchetypePage;
