'use server';

import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/session';
import {
  createOpponentArchetypeSchema,
  type OpponentArchetypeActionResult,
} from '@/lib/types';
import { slugify } from '@/lib/utils';
import { redirect } from 'next/navigation';

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
  const rawSlug = formData.get('slug') as string;
  const slug = rawSlug?.trim() ? rawSlug.trim() : slugify({ name });

  const result = createOpponentArchetypeSchema.safeParse({ name, slug });

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
        slug: result.data.slug,
        archetypeId,
        isRogue: false,
      },
    });

    return {
      success: true,
      data: { id: created.id, name: created.name, slug: created.slug },
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
        error: 'An opponent archetype with that name or slug already exists',
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
  const rawSlug = formData.get('slug') as string;
  const slug = rawSlug?.trim() ? rawSlug.trim() : slugify({ name });

  const result = createOpponentArchetypeSchema.safeParse({ name, slug });

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const opponentArchetype = await prisma.opponentArchetype.findUnique({
    where: { id: opponentArchetypeId },
    include: { archetype: true },
  });

  if (!opponentArchetype || opponentArchetype.archetype.userId !== user.userId) {
    return { success: false, error: 'Opponent archetype not found' };
  }

  try {
    const updated = await prisma.opponentArchetype.update({
      where: { id: opponentArchetypeId },
      data: { name: result.data.name, slug: result.data.slug },
    });

    return {
      success: true,
      data: { id: updated.id, name: updated.name, slug: updated.slug },
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
        error: 'An opponent archetype with that name or slug already exists',
      };
    }

    throw error;
  }
};

const deleteOpponentArchetype = async ({
  opponentArchetypeId,
}: {
  opponentArchetypeId: string;
}): Promise<OpponentArchetypeActionResult> => {
  const user = await getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }

  const opponentArchetype = await prisma.opponentArchetype.findUnique({
    where: { id: opponentArchetypeId },
    include: {
      archetype: true,
      _count: { select: { matches: true } },
    },
  });

  if (!opponentArchetype) {
    return { success: false, error: 'Opponent archetype not found' };
  }

  if (opponentArchetype.archetype.userId !== user.userId) {
    return {
      success: false,
      error: 'You do not have permission to delete this opponent archetype',
    };
  }

  if (opponentArchetype._count.matches > 0) {
    return {
      success: false,
      error: 'Cannot delete: this archetype is used in existing matches.',
    };
  }

  await prisma.opponentArchetype.delete({ where: { id: opponentArchetypeId } });

  redirect(
    `/archetypes/${opponentArchetype.archetype.slug}/opponent-archetypes`,
  );
};

const createOpponentArchetypeInline = async ({
  archetypeId,
  name,
}: {
  archetypeId: string;
  name: string;
}): Promise<{ id: string } | { error: string }> => {
  const user = await getUser();

  if (!user) {
    return { error: 'You must be logged in' };
  }

  const slug = slugify({ name });

  const result = createOpponentArchetypeSchema.safeParse({ name, slug });

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const archetype = await prisma.archetype.findUnique({
    where: { id: archetypeId },
  });

  if (!archetype || archetype.userId !== user.userId) {
    return { error: 'Archetype not found' };
  }

  try {
    const created = await prisma.opponentArchetype.create({
      data: {
        name: result.data.name,
        slug: result.data.slug,
        archetypeId,
        isRogue: false,
      },
    });

    return { id: created.id };
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      // If a duplicate exists, look up and return the existing record's id
      const existing = await prisma.opponentArchetype.findFirst({
        where: { archetypeId, name: result.data.name },
      });

      if (existing) {
        return { id: existing.id };
      }

      return { error: 'An opponent archetype with that name already exists' };
    }

    return { error: 'Failed to create opponent archetype' };
  }
};

export {
  getOpponentArchetypesForArchetype,
  createOpponentArchetype,
  updateOpponentArchetype,
  deleteOpponentArchetype,
  createOpponentArchetypeInline,
};
