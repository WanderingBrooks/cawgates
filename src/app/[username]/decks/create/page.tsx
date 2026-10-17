import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getUser } from '@/lib/session';
import { PageTitle, DeckForm } from '@/components';
import { getDecksForOwner, getFormatsForOwner } from '@/lib/dal';

const CreateDeckPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ format?: string | string[] }>;
}) => {
  const [{ username }, { format }, user] = await Promise.all([
    params,
    searchParams,
    getUser(),
  ]);

  if (!user || user.username !== username) {
    notFound();
  }

  const [t, { decks }, { formats }] = await Promise.all([
    getTranslations('createDeck'),
    getDecksForOwner({ ownerUsername: username }),
    getFormatsForOwner({ ownerUsername: username }),
  ]);

  const isFirstDeck = decks.length === 0;

  // Only preselect one of the owner's own formats
  const initialFormatId = formats.find(({ id }) => id === format)?.id;

  return (
    <>
      <PageTitle title={t('title')} />
      {isFirstDeck && <h3>{t('firstDeckSubtitle')}</h3>}
      <DeckForm
        mode="create"
        username={username}
        initialFormatId={initialFormatId}
      />
    </>
  );
};

export default CreateDeckPage;
