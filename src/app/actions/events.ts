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

const updateEventWithMatches = async (
  eventId: string,
  eventData: EventFormData,
  matches: MatchData[],
) => {
  const existingEvent = await prisma.event.findUnique({
    where: { id: eventId },
    include: { matches: true },
  });

  if (!existingEvent) {
    throw new Error('Event not found');
  }

  const existingMatchIds = existingEvent.matches.map(m => m.id);
  const newMatchIds = matches.filter(m => m.id).map(m => m.id!);
  const matchesToDelete = existingMatchIds.filter(
    id => !newMatchIds.includes(id),
  );

  await prisma.event.update({
    where: { id: eventId },
    data: {
      name: eventData.eventName,
      date: new Date(eventData.eventDate),
      notes: eventData.notes,
      matches: {
        deleteMany: {
          id: { in: matchesToDelete },
        },
        upsert: matches.map(match => ({
          where: { id: match.id || 'new' },
          create: {
            opponentArchetype: match.opponentArchetype,
            wins: match.wins,
            losses: match.losses,
          },
          update: {
            opponentArchetype: match.opponentArchetype,
            wins: match.wins,
            losses: match.losses,
          },
        })),
      },
    },
  });

  redirect(`/events/${eventId}`);
};

export {
  createEventWithMatches,
  deleteEventAndMatches,
  updateEventWithMatches,
};
