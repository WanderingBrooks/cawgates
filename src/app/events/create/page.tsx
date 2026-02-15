import { getTranslations } from 'next-intl/server';
import { Page, PageTitle } from '@/components';
import EventForm from '../EventForm';

const CreateEventPage = async () => {
  const t = await getTranslations('createEvent');

  return (
    <Page>
      <PageTitle title={t('title')} />
      <EventForm mode="create" />
    </Page>
  );
};

export default CreateEventPage;
