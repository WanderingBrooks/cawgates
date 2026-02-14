'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

const createEventWithMatches = async (
  formData: FormData,
  matches: Array<{ opponentDeck: string; wins: number; losses: number }>,
) => {
  const eventName = formData.get('eventName') as string;
  const eventDate = new Date(formData.get('eventDate') as string);
  const notes = formData.get('notes') as string;

  const event = await prisma.event.create({
    data: {
      name: eventName,
      date: eventDate,
      notes,
      matches: {
        create: matches.map(match => ({
          opponentDeck: match.opponentDeck,
          wins: match.wins,
          losses: match.losses,
        })),
      },
    },
  });

  redirect(`/events/${event.id}`);
};

export { createEventWithMatches };
