import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getUser } from '@/lib/session';
import { PageTitle, DeckForm } from '@/components';
import { getDecksForOwner } from '@/lib/dal';

const CreateDeckPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const [{ username }, user] = await Promise.all([params, getUser()]);

  if (!user || user.username !== username) {
    notFound();
  }

  const [t, { decks }] = await Promise.all([
    getTranslations('createDeck'),
    getDecksForOwner({ ownerUsername: username }),
  ]);

  const isFirstDeck = decks.length === 0;

  return (
    <>
      <PageTitle title={t('title')} />
      {isFirstDeck && <h3>{t('firstDeckSubtitle')}</h3>}
      <DeckForm mode="create" username={username} />
    </>
  );
};

export default CreateDeckPage;
