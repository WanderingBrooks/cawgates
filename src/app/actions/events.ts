'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import {
  createEventSchema,
  updateEventSchema,
  type ActionResult,
} from '@/lib/types';
import { getUser } from '@/lib/session';

const createEvent = async (
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> => {
  let eventId: string;
  let username: string;

  try {
    const user = await getUser();

    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to create an event',
      };
    }

    const data = {
      deckId: formData.get('deckId') as string,
      eventName: formData.get('eventName') as string,
      eventDate: formData.get('eventDate') as string,
      notes: formData.get('notes') as string,
    };

    const result = createEventSchema.safeParse(data);

    if (!result.success) {
      const firstError = result.error.issues[0];

      return {
        success: false,
        error: firstError.message,
      };
    }

    const validated = result.data;

    const deck = await prisma.deck.findUnique({
      where: { id: validated.deckId },
    });

    if (!deck || deck.userId !== user.userId) {
      return { success: false, error: 'Deck not found' };
    }

    const event = await prisma.event.create({
      data: {
        name: validated.eventName,
        date: new Date(validated.eventDate),
        notes: validated.notes,
        deckId: validated.deckId,
      },
    });

    eventId = event.id;
    username = user.username;
  } catch (error) {
    console.error('Failed to create event:', error);

    return {
      success: false,
      error: 'Failed to create event. Please try again.',
    };
  }

  redirect(`/${username}/events/${eventId}`);
};

const updateEvent = async (
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> => {
  let eventId: string;
  let username: string;

  try {
    const user = await getUser();

    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to update an event',
      };
    }

    const data = {
      deckId: formData.get('deckId') as string,
      eventId: formData.get('eventId') as string,
      eventName: formData.get('eventName') as string,
      eventDate: formData.get('eventDate') as string,
      notes: formData.get('notes') as string,
    };

    const result = updateEventSchema.safeParse(data);

    if (!result.success) {
      const firstError = result.error.issues[0];

      return {
        success: false,
        error: firstError.message,
      };
    }

    const validated = result.data;

    const existingEvent = await prisma.event.findUnique({
      where: { id: validated.eventId },
      include: { deck: true },
    });

    if (!existingEvent) {
      return { success: false, error: 'Event not found' };
    }

    if (existingEvent.deck.userId !== user.userId) {
      return {
        success: false,
        error: 'You do not have permission to edit this event',
      };
    }

    await prisma.event.update({
      where: { id: validated.eventId },
      data: {
        name: validated.eventName,
        date: new Date(validated.eventDate),
        notes: validated.notes,
      },
    });

    eventId = validated.eventId;
    username = user.username;
  } catch (error) {
    console.error('Failed to update event:', error);

    return {
      success: false,
      error: 'Failed to update event. Please try again.',
    };
  }

  redirect(`/${username}/events/${eventId}`);
};

/**
 * Delete an event and all associated matches. Redirect back to the event list afterward.
 */
const deleteEvent = async (eventId: string): Promise<ActionResult> => {
  let username: string;

  try {
    const user = await getUser();

    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to delete an event',
      };
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { deck: true },
    });

    if (!event) {
      return {
        success: false,
        error: 'Event not found',
      };
    }

    if (event.deck.userId !== user.userId) {
      return {
        success: false,
        error: 'You do not have permission to delete this event',
      };
    }

    username = user.username;

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

  redirect(`/${username}/events`);
};

export { createEvent, updateEvent, deleteEvent };
