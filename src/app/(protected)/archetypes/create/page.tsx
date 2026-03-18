import { getTranslations } from 'next-intl/server';
import { PageTitle } from '@/components';
import ArchetypeForm from '../ArchetypeForm';

const CreateArchetypePage = async () => {
  const t = await getTranslations('createArchetype');

  return (
    <>
      <PageTitle title={t('title')} />
      <ArchetypeForm mode="create" />
    </>
  );
};

export default CreateArchetypePage;
