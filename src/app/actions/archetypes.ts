'use server';

import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/session';
import { createArchetypeSchema } from '@/lib/types';
import { slugify } from '@/lib/slugify';
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

  const name = formData.get('name') as string;
  const rawSlug = formData.get('slug') as string;
  // Auto-derive slug from name if the user left the field blank
  const slug = rawSlug?.trim() ? rawSlug.trim() : slugify({ name });

  const result = createArchetypeSchema.safeParse({ name, slug });

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    const archetype = await prisma.archetype.create({
      data: {
        name: result.data.name,
        slug: result.data.slug,
        userId: user.userId,
      },
    });

    redirect(`/archetypes/${archetype.slug}`);
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return { success: false, error: 'An archetype with that name or slug already exists' };
    }

    throw error;
  }
};

const updateArchetype = async (
  _prevState: ArchetypeActionResult | null,
  formData: FormData,
): Promise<ArchetypeActionResult> => {
  const user = await getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }

  const archetypeId = formData.get('archetypeId') as string;
  const name = formData.get('name') as string;
  const rawSlug = formData.get('slug') as string;
  const slug = rawSlug?.trim() ? rawSlug.trim() : slugify({ name });

  const result = createArchetypeSchema.safeParse({ name, slug });

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
    const updated = await prisma.archetype.update({
      where: { id: archetypeId },
      data: { name: result.data.name, slug: result.data.slug },
    });

    redirect(`/archetypes/${updated.slug}`);
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return { success: false, error: 'An archetype with that name or slug already exists' };
    }

    throw error;
  }
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

export { getUserArchetypes, createArchetype, updateArchetype, deleteArchetype, getOpponentArchetypes };
