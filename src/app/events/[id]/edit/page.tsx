import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Page, Button, PageTitle } from '@/components';
import EventForm from '../../EventForm';
import { EventFormData, MatchInput } from '@/lib/types';
import { getTranslations } from 'next-intl/server';
import { getUser } from '@/lib/session';

const EditEventPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const t = await getTranslations('editEvent');
  const user = await getUser();

  if (!user) {
    return null; // Middleware will redirect
  }

  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id, userId: user.userId },
    include: { matches: true },
  });

  if (!event) {
    notFound();
  }

  const initialEventData: EventFormData = {
    eventName: event.name || '',
    eventDate: event.date.toISOString().split('T')[0],
    notes: event.notes || '',
  };

  const initialMatches: MatchInput[] = event.matches.map(match => ({
    id: match.id,
    opponentArchetype: match.opponentArchetype,
    wins: match.wins,
    losses: match.losses,
  }));

  return (
    <Page>
      <PageTitle>
        <h1>{t('title')}</h1>
        <Link href={`/events/${id}`}>
          <Button>{t('backToEvent')}</Button>
        </Link>
      </PageTitle>

      <EventForm
        mode="edit"
        eventId={id}
        initialEventData={initialEventData}
        initialMatches={initialMatches}
      />
    </Page>
  );
};

export default EditEventPage;
