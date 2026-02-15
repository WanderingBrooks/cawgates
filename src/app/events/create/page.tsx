import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Page, Button, PageTitle } from '@/components';
import EventForm from '../EventForm';

const CreateEventPage = async () => {
  const t = await getTranslations('createEvent');

  return (
    <Page>
      <PageTitle>
        <h1>{t('title')}</h1>
        <Link href="/events">
          <Button>{t('viewEvents')}</Button>
        </Link>
      </PageTitle>

      <EventForm mode="create" />
    </Page>
  );
};

export default CreateEventPage;
