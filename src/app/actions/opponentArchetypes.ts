'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/session';
import { logEvent } from '@/lib/log';
import {
  createOpponentArchetypeSchema,
  type ActionResult,
  type ActionResultWithData,
} from '@/lib/types';

const getOpponentArchetypesForArchetype = async ({
  deckId,
}: {
  deckId: string;
}) => {
  const user = await getUser();

  if (!user) {
    return [];
  }

  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
  });

  if (!deck || deck.userId !== user.userId) {
    return [];
  }

  return prisma.opponentArchetype.findMany({
    where: { formatId: deck.formatId },
    orderBy: { name: 'asc' },
  });
};

const createOpponentArchetype = async (
  _prevState: ActionResultWithData<{ id: string; name: string }> | null,
  formData: FormData,
): Promise<ActionResultWithData<{ id: string; name: string }>> => {
  const user = await getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }

  const deckId = formData.get('deckId') as string;
  const name = formData.get('name') as string;

  const result = createOpponentArchetypeSchema.safeParse({ name });

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
  });

  if (!deck || deck.userId !== user.userId) {
    return { success: false, error: 'Deck not found' };
  }

  try {
    const created = await prisma.opponentArchetype.create({
      data: {
        name: result.data.name,
        formatId: deck.formatId,
      },
    });

    logEvent('opponentArchetype.created', {
      userId: user.userId,
      deckId,
      formatId: created.formatId,
      opponentArchetypeId: created.id,
    });

    return {
      success: true,
      data: { id: created.id, name: created.name },
    };
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return {
        success: false,
        error: 'An opponent archetype with that name already exists',
      };
    }

    throw error;
  }
};

const updateOpponentArchetype = async (
  _prevState: ActionResultWithData<{ id: string; name: string }> | null,
  formData: FormData,
): Promise<ActionResultWithData<{ id: string; name: string }>> => {
  const user = await getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }

  const opponentArchetypeId = formData.get('opponentArchetypeId') as string;
  const name = formData.get('name') as string;

  const result = createOpponentArchetypeSchema.safeParse({ name });

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const opponentArchetype = await prisma.opponentArchetype.findUnique({
    where: { id: opponentArchetypeId },
    include: { format: true },
  });

  if (!opponentArchetype || opponentArchetype.format.userId !== user.userId) {
    return { success: false, error: 'Opponent archetype not found' };
  }

  try {
    const updated = await prisma.opponentArchetype.update({
      where: { id: opponentArchetypeId },
      data: { name: result.data.name },
    });

    logEvent('opponentArchetype.updated', {
      userId: user.userId,
      formatId: updated.formatId,
      opponentArchetypeId: updated.id,
    });

    return {
      success: true,
      data: { id: updated.id, name: updated.name },
    };
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return {
        success: false,
        error: 'An opponent archetype with that name already exists',
      };
    }

    throw error;
  }
};

const deleteOpponentArchetype = async ({
  opponentArchetypeId,
}: {
  opponentArchetypeId: string;
}): Promise<ActionResult> => {
  const user = await getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }

  const opponentArchetype = await prisma.opponentArchetype.findUnique({
    where: { id: opponentArchetypeId },
    include: { format: true, _count: { select: { matches: true } } },
  });

  if (!opponentArchetype || opponentArchetype.format.userId !== user.userId) {
    return { success: false, error: 'Opponent archetype not found' };
  }

  if (opponentArchetype._count.matches > 0) {
    return {
      success: false,
      error: 'Cannot delete an opponent archetype that has matches.',
    };
  }

  try {
    await prisma.opponentArchetype.delete({
      where: { id: opponentArchetypeId },
    });
  } catch (error) {
    // A match added after the count above blocks the delete
    console.error('Failed to delete opponent archetype:', error);

    return {
      success: false,
      error: 'Failed to delete opponent archetype. Please try again.',
    };
  }

  logEvent('opponentArchetype.deleted', {
    userId: user.userId,
    formatId: opponentArchetype.formatId,
    opponentArchetypeId,
  });

  revalidatePath(`/${user.username}/matchups/${opponentArchetype.formatId}`);

  return { success: true };
};

export {
  getOpponentArchetypesForArchetype,
  deleteOpponentArchetype,
  createOpponentArchetype,
  updateOpponentArchetype,
};
