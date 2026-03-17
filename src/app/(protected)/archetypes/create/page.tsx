import { getTranslations } from 'next-intl/server';
import { getUser } from '@/lib/session';
import { PageTitle } from '@/components';
import CreateArchetypeForm from './CreateArchetypeForm';

const CreateArchetypePage = async () => {
  const t = await getTranslations('createArchetype');
  const user = await getUser();

  if (!user) {
    return null; // Middleware will redirect
  }

  return (
    <>
      <PageTitle title={t('title')} showLogout />
      <CreateArchetypeForm />
    </>
  );
};

export default CreateArchetypePage;
