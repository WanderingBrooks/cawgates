'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/session';
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
    where: { deckId },
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
        deckId,
      },
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
    include: { deck: true },
  });

  if (
    !opponentArchetype ||
    opponentArchetype.deck.userId !== user.userId
  ) {
    return { success: false, error: 'Opponent archetype not found' };
  }

  try {
    const updated = await prisma.opponentArchetype.update({
      where: { id: opponentArchetypeId },
      data: { name: result.data.name },
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
  let deckSlug: string;
  let username: string;

  try {
    const user = await getUser();

    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to delete an opponent archetype',
      };
    }

    const opponentArchetype = await prisma.opponentArchetype.findUnique({
      where: { id: opponentArchetypeId },
      include: { deck: true },
    });

    if (!opponentArchetype) {
      return {
        success: false,
        error: 'Opponent archetype not found',
      };
    }

    if (opponentArchetype.deck.userId !== user.userId) {
      return {
        success: false,
        error: 'You do not have permission to delete this opponent archetype',
      };
    }

    const matchCount = await prisma.match.count({
      where: { opponentArchetypeId },
    });

    if (matchCount > 0) {
      return {
        success: false,
        error: 'Cannot delete an opponent archetype that has matches.',
      };
    }

    deckSlug = opponentArchetype.deck.slug;
    username = user.username;

    await prisma.opponentArchetype.delete({
      where: { id: opponentArchetypeId },
    });
  } catch (error) {
    console.error('Failed to delete opponent archetype:', error);

    return {
      success: false,
      error: 'Failed to delete opponent archetype. Please try again.',
    };
  }

  redirect(`/${username}/${deckSlug}`);
};

export {
  getOpponentArchetypesForArchetype,
  createOpponentArchetype,
  updateOpponentArchetype,
  deleteOpponentArchetype,
};
