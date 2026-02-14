'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { EventFormData, MatchData } from '@/lib/types';

const createEventWithMatches = async (
  eventData: EventFormData,
  matches: MatchData[],
) => {
  const event = await prisma.event.create({
    data: {
      name: eventData.eventName,
      date: new Date(eventData.eventDate),
      notes: eventData.notes,
      matches: {
        create: matches,
      },
    },
  });

  redirect(`/events/${event.id}`);
};

const deleteEventAndMatches = async (eventId: string) => {
  await prisma.event.delete({
    where: {
      id: eventId,
    },
  });

  redirect(`/events`);
};

export { createEventWithMatches, deleteEventAndMatches };
