import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getUser } from '@/lib/session';
import { PageTitle } from '@/components';
import DeckForm from '../DeckForm';

const CreateDeckPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const [{ username }, user] = await Promise.all([params, getUser()]);

  if (!user || user.username !== username) {
    notFound();
  }

  const t = await getTranslations('createDeck');

  return (
    <>
      <PageTitle title={t('title')} />
      <DeckForm mode="create" username={username} />
    </>
  );
};

export default CreateDeckPage;
