'use server';

import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/session';
import { createArchetypeSchema } from '@/lib/types';
import { redirect } from 'next/navigation';

export type ArchetypeActionResult = {
  success: boolean;
  error?: string;
};

// --- User's own deck archetypes ---

const getUserArchetypes = async () => {
  const user = await getUser();

  if (!user) {
    return [];
  }

  return prisma.archetype.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: 'asc' },
    include: {
      _count: { select: { events: true } },
    },
  });
};

const createArchetype = async (
  _prevState: ArchetypeActionResult | null,
  formData: FormData,
): Promise<ArchetypeActionResult> => {
  const user = await getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }

  const result = createArchetypeSchema.safeParse({
    name: formData.get('name') as string,
  });

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const archetype = await prisma.archetype.create({
    data: {
      name: result.data.name,
      userId: user.userId,
    },
  });

  redirect(`/archetypes/${archetype.id}`);
};

const deleteArchetype = async (
  archetypeId: string,
): Promise<ArchetypeActionResult> => {
  const user = await getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }

  const archetype = await prisma.archetype.findUnique({
    where: { id: archetypeId },
  });

  if (!archetype) {
    return { success: false, error: 'Archetype not found' };
  }

  if (archetype.userId !== user.userId) {
    return { success: false, error: 'You do not have permission to delete this archetype' };
  }

  await prisma.archetype.delete({ where: { id: archetypeId } });

  redirect('/archetypes');
};

// --- Opponent archetypes (strings used in matches, scoped to a user archetype) ---

const getOpponentArchetypes = async (archetypeId: string): Promise<string[]> => {
  try {
    const matches = await prisma.match.findMany({
      where: {
        event: { archetypeId },
      },
      select: {
        opponentArchetype: true,
      },
      distinct: ['opponentArchetype'],
      orderBy: {
        opponentArchetype: 'asc',
      },
    });

    return matches.map(match => match.opponentArchetype);
  } catch (error) {
    console.error('Failed to fetch opponent archetypes:', error);

    return [];
  }
};

export { getUserArchetypes, createArchetype, deleteArchetype, getOpponentArchetypes };
