'use server';

import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/session';
import {
  createOpponentArchetypeSchema,
  type OpponentArchetypeActionResult,
} from '@/lib/types';

const getOpponentArchetypesForArchetype = async ({
  archetypeId,
}: {
  archetypeId: string;
}) => {
  const user = await getUser();

  if (!user) {
    return [];
  }

  const archetype = await prisma.archetype.findUnique({
    where: { id: archetypeId },
  });

  if (!archetype || archetype.userId !== user.userId) {
    return [];
  }

  return prisma.opponentArchetype.findMany({
    where: { archetypeId },
    orderBy: { name: 'asc' },
  });
};

const createOpponentArchetype = async (
  _prevState: OpponentArchetypeActionResult | null,
  formData: FormData,
): Promise<OpponentArchetypeActionResult> => {
  const user = await getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }

  const archetypeId = formData.get('archetypeId') as string;
  const name = formData.get('name') as string;

  const result = createOpponentArchetypeSchema.safeParse({ name });

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const archetype = await prisma.archetype.findUnique({
    where: { id: archetypeId },
  });

  if (!archetype || archetype.userId !== user.userId) {
    return { success: false, error: 'Archetype not found' };
  }

  try {
    const created = await prisma.opponentArchetype.create({
      data: {
        name: result.data.name,
        archetypeId,
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
  _prevState: OpponentArchetypeActionResult | null,
  formData: FormData,
): Promise<OpponentArchetypeActionResult> => {
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
    include: { archetype: true },
  });

  if (
    !opponentArchetype ||
    opponentArchetype.archetype.userId !== user.userId
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

export {
  getOpponentArchetypesForArchetype,
  createOpponentArchetype,
  updateOpponentArchetype,
};
