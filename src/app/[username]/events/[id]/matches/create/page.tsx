import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { PageTitle } from '@/components';
import { getEvent } from '@/lib/dal';
import MatchForm from '../MatchForm';

const CreateMatchPage = async ({
  params,
}: {
  params: Promise<{ username: string; id: string }>;
}) => {
  const { username, id } = await params;
  const t = await getTranslations('createMatch');

  const { event, isOwner } = await getEvent({
    eventId: id,
    ownerUsername: username,
  });

  if (!isOwner) {
    notFound();
  }

  return (
    <>
      <PageTitle title={t('title')} subtitle={event.name} />
      <MatchForm
        mode="create"
        username={username}
        deckId={event.deckId}
        eventId={id}
      />
    </>
  );
};

export default CreateMatchPage;
