import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { PageTitle } from '@/components';
import { getDeck } from '@/lib/dal';
import DeckForm from '../../DeckForm';

const EditDeckPage = async ({
  params,
}: {
  params: Promise<{ username: string; deckSlug: string }>;
}) => {
  const t = await getTranslations('editDeck');
  const { username, deckSlug } = await params;

  const { deck, isOwner } = await getDeck({
    ownerUsername: username,
    deckSlug,
  });

  if (!isOwner) {
    notFound();
  }

  return (
    <>
      <PageTitle title={t('title')} subtitle={deck.name} />
      <DeckForm
        mode="edit"
        username={username}
        deckId={deck.id}
        deckSlug={deck.slug}
        initialDeckData={deck}
      />
    </>
  );
};

export default EditDeckPage;
