'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { createEventSchema, updateEventSchema } from '@/lib/types';

export type ActionResult = {
  success: boolean;
  error?: string;
  eventId?: string;
};

type ParsedMatch = {
  id?: string;
  opponentArchetype: string;
  wins: number;
  losses: number;
};

// Helper function to parse matches array from FormData
const parseMatches = (formData: FormData): ParsedMatch[] => {
  let index = 0;
  const matches: ParsedMatch[] = [];

  while (formData.has(`matches[${index}].opponentArchetype`)) {
    const id = formData.get(`matches[${index}].id`) as string | null;

    const opponentArchetype = formData.get(
      `matches[${index}].opponentArchetype`,
    ) as string;

    const wins =
      parseInt(formData.get(`matches[${index}].wins`) as string) || 0;

    const losses =
      parseInt(formData.get(`matches[${index}].losses`) as string) || 0;

    // Only include id if it exists (for edit mode)
    matches.push(
      id
        ? { id, opponentArchetype, wins, losses }
        : { opponentArchetype, wins, losses },
    );

    index++;
  }

  return matches;
};

const createEventWithMatches = async (
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> => {
  let eventId: string;

  try {
    // Parse FormData
    const matches = parseMatches(formData);

    const data = {
      eventName: formData.get('eventName') as string,
      eventDate: formData.get('eventDate') as string,
      notes: formData.get('notes') as string,
      matches,
    };

    // Validate with Zod
    const result = createEventSchema.safeParse(data);

    if (!result.success) {
      const firstError = result.error.issues[0];

      return {
        success: false,
        error: firstError.message,
      };
    }

    // Type-safe validated data
    const validated = result.data;

    const event = await prisma.event.create({
      data: {
        name: validated.eventName,
        date: new Date(validated.eventDate),
        notes: validated.notes,
        matches: {
          create: validated.matches.map(m => ({
            opponentArchetype: m.opponentArchetype,
            wins: m.wins,
            losses: m.losses,
          })),
        },
      },
    });

    eventId = event.id;
  } catch (error) {
    console.error('Failed to create event:', error);

    return {
      success: false,
      error: 'Failed to create event. Please try again.',
    };
  }

  redirect(`/events/${eventId}`);
};

const deleteEventAndMatches = async (
  eventId: string,
): Promise<ActionResult> => {
  try {
    await prisma.event.delete({
      where: {
        id: eventId,
      },
    });
  } catch (error) {
    console.error('Failed to delete event:', error);

    return {
      success: false,
      error: 'Failed to delete event. Please try again.',
    };
  }

  redirect('/events');
};

const updateEventWithMatches = async (
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> => {
  let eventId: string;

  try {
    // Parse FormData
    const matches = parseMatches(formData);

    const data = {
      eventId: formData.get('eventId') as string,
      eventName: formData.get('eventName') as string,
      eventDate: formData.get('eventDate') as string,
      notes: formData.get('notes') as string,
      matches,
    };

    // Validate with Zod
    const result = updateEventSchema.safeParse(data);

    if (!result.success) {
      const firstError = result.error.issues[0];

      return {
        success: false,
        error: firstError.message,
      };
    }

    // Type-safe validated data
    const validated = result.data;

    const existingEvent = await prisma.event.findUnique({
      where: { id: validated.eventId },
      include: { matches: true },
    });

    if (!existingEvent) {
      return { success: false, error: 'Event not found' };
    }

    const existingMatchIds = existingEvent.matches.map(m => m.id);

    const newMatchIds = validated.matches.filter(m => m.id).map(m => m.id!);

    const matchesToDelete = existingMatchIds.filter(
      id => !newMatchIds.includes(id),
    );

    await prisma.event.update({
      where: { id: validated.eventId },
      data: {
        name: validated.eventName,
        date: new Date(validated.eventDate),
        notes: validated.notes,
        matches: {
          deleteMany: {
            id: { in: matchesToDelete },
          },
          upsert: validated.matches.map(match => ({
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

    eventId = validated.eventId;
  } catch (error) {
    console.error('Failed to update event:', error);

    return {
      success: false,
      error: 'Failed to update event. Please try again.',
    };
  }

  redirect(`/events/${eventId}`);
};

export {
  createEventWithMatches,
  deleteEventAndMatches,
  updateEventWithMatches,
};
