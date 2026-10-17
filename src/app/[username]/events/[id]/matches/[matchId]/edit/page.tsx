import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { PageTitle } from '@/components';
import { getMatch } from '@/lib/dal';
import { MatchInputForm } from '@/lib/types';
import MatchForm from '../../MatchForm';

const EditMatchPage = async ({
  params,
}: {
  params: Promise<{ username: string; id: string; matchId: string }>;
}) => {
  const { username, id, matchId } = await params;
  const t = await getTranslations('editMatch');

  const { event, match, isOwner } = await getMatch({
    ownerUsername: username,
    eventId: id,
    matchId,
  });

  if (!isOwner) {
    notFound();
  }

  const initialMatchData: MatchInputForm = {
    id: match.id,
    opponentArchetypeId: match.opponentArchetypeId,
    wins: match.wins,
    losses: match.losses,
    notes: match.notes ?? '',
  };

  return (
    <>
      <PageTitle title={t('title')} subtitle={event.name} />
      <MatchForm
        mode="edit"
        username={username}
        deckId={event.deckId}
        eventId={id}
        matchId={matchId}
        initialMatchData={initialMatchData}
      />
    </>
  );
};

export default EditMatchPage;
