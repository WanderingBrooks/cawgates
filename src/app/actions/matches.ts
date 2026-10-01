'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import {
  createMatchSchema,
  updateMatchSchema,
  type ActionResult,
} from '@/lib/types';
import { getUser } from '@/lib/session';
import { logEvent } from '@/lib/log';

const createMatch = async (
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> => {
  try {
    const user = await getUser();

    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to create a match',
      };
    }

    const data = {
      matchId: formData.get('matchId') as string,
      eventId: formData.get('eventId') as string,
      opponentArchetypeId: formData.get('opponentArchetypeId') as string,
      wins: parseInt(formData.get('wins') as string) || 0,
      losses: parseInt(formData.get('losses') as string) || 0,
      notes: formData.get('notes') as string,
    };

    const result = createMatchSchema.safeParse(data);

    if (!result.success) {
      const firstError = result.error.issues[0];

      return {
        success: false,
        error: firstError.message,
      };
    }

    const validated = result.data;

    const event = await prisma.event.findUnique({
      where: { id: validated.eventId },
      include: { deck: true },
    });

    if (!event || event.deck.userId !== user.userId) {
      return { success: false, error: 'Event not found' };
    }

    let isRetry = false;

    try {
      await prisma.match.create({
        data: {
          id: validated.matchId,
          eventId: validated.eventId,
          opponentArchetypeId: validated.opponentArchetypeId,
          wins: validated.wins,
          losses: validated.losses,
          notes: validated.notes,
        },
      });
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === 'P2002'
      ) {
        // A match with this id already exists. If it's in the same event
        // (which this user owns, checked above) it was created by an earlier
        // submit of this same form, so report success instead of duplicating.
        const existing = await prisma.match.findUnique({
          where: { id: validated.matchId },
        });

        if (existing?.eventId !== validated.eventId) {
          return { success: false, error: 'Failed to create match' };
        }

        isRetry = true;
      } else {
        throw error;
      }
    }

    revalidatePath(
      `/${user.username}/${event.deck.slug}/events/${validated.eventId}`,
    );

    logEvent(isRetry ? 'match.createRetried' : 'match.created', {
      userId: user.userId,
      eventId: validated.eventId,
      matchId: validated.matchId,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to create match:', error);

    return {
      success: false,
      error: 'Failed to create match. Please try again.',
    };
  }
};

const updateMatch = async (
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> => {
  try {
    const user = await getUser();

    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to update a match',
      };
    }

    const data = {
      matchId: formData.get('matchId') as string,
      eventId: formData.get('eventId') as string,
      opponentArchetypeId: formData.get('opponentArchetypeId') as string,
      wins: parseInt(formData.get('wins') as string) || 0,
      losses: parseInt(formData.get('losses') as string) || 0,
      notes: formData.get('notes') as string,
    };

    const result = updateMatchSchema.safeParse(data);

    if (!result.success) {
      const firstError = result.error.issues[0];

      return {
        success: false,
        error: firstError.message,
      };
    }

    const validated = result.data;

    const match = await prisma.match.findUnique({
      where: { id: validated.matchId },
      include: {
        event: {
          include: { deck: true },
        },
      },
    });

    if (!match || match.event.deck.userId !== user.userId) {
      return { success: false, error: 'Match not found' };
    }

    await prisma.match.update({
      where: { id: validated.matchId },
      data: {
        opponentArchetypeId: validated.opponentArchetypeId,
        wins: validated.wins,
        losses: validated.losses,
        notes: validated.notes,
      },
    });

    revalidatePath(
      `/${user.username}/${match.event.deck.slug}/events/${match.eventId}`,
    );

    logEvent('match.updated', {
      userId: user.userId,
      eventId: match.eventId,
      matchId: match.id,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to update match:', error);

    return {
      success: false,
      error: 'Failed to update match. Please try again.',
    };
  }
};

const deleteMatch = async (matchId: string): Promise<ActionResult> => {
  try {
    const user = await getUser();

    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to delete a match',
      };
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        event: {
          include: { deck: true },
        },
      },
    });

    if (!match || match.event.deck.userId !== user.userId) {
      return { success: false, error: 'Match not found' };
    }

    await prisma.match.delete({ where: { id: matchId } });

    revalidatePath(
      `/${user.username}/${match.event.deck.slug}/events/${match.eventId}`,
    );

    logEvent('match.deleted', {
      userId: user.userId,
      eventId: match.eventId,
      matchId: match.id,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to delete match:', error);

    return {
      success: false,
      error: 'Failed to delete match. Please try again.',
    };
  }
};

export { createMatch, updateMatch, deleteMatch };
