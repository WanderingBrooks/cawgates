import { getTranslations } from 'next-intl/server';
import { PageTitle } from '@/components';
import EventForm from '../EventForm';

const CreateEventPage = async () => {
  const t = await getTranslations('createEvent');

  return (
    <>
      <PageTitle title={t('title')} showLogout />
      <EventForm mode="create" />
    </>
  );
};

export default CreateEventPage;
