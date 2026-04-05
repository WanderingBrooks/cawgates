'use server';

import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/session';
import { createArchetypeSchema, type ActionResult } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { redirect } from 'next/navigation';

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
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> => {
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

    redirect(`/${user.username}/${archetype.slug}`);
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return {
        success: false,
        error: 'You already have an archetype with that name or slug',
      };
    }

    throw error;
  }
};

const updateArchetype = async (
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> => {
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

    redirect(`/${user.username}/${updated.slug}`);
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return {
        success: false,
        error: 'You already have an archetype with that name or slug',
      };
    }

    throw error;
  }
};

const deleteArchetype = async (
  archetypeId: string,
): Promise<ActionResult> => {
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
    return {
      success: false,
      error: 'You do not have permission to delete this archetype',
    };
  }

  await prisma.archetype.delete({ where: { id: archetypeId } });

  redirect(`/${user.username}`);
};

export {
  getUserArchetypes,
  createArchetype,
  updateArchetype,
  deleteArchetype,
};
