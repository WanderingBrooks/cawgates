'use server';

import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/session';
import { createDeckSchema, type ActionResult } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { elapsedMs, logEvent } from '@/lib/log';
import { redirect } from 'next/navigation';

// --- User's own decks ---

const getUserDecks = async () => {
  const user = await getUser();

  if (!user) {
    return [];
  }

  return prisma.deck.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: 'asc' },
    include: {
      _count: { select: { events: true } },
    },
  });
};

const createDeck = async (
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> => {
  const startedAt = performance.now();
  const user = await getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }

  const name = formData.get('name') as string;
  const isPublic = formData.get('isPublic') as string;
  const rawSlug = formData.get('slug') as string;
  // Auto-derive slug from name if the user left the field blank
  const slug = rawSlug?.trim() ? rawSlug.trim() : slugify({ name });

  const result = createDeckSchema.safeParse({ name, slug, isPublic });

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    const deck = await prisma.deck.create({
      data: {
        name: result.data.name,
        slug: result.data.slug,
        isPublic: result.data.isPublic,
        userId: user.userId,
      },
    });

    logEvent('deck.created', {
      userId: user.userId,
      deckId: deck.id,
      durationMs: elapsedMs(startedAt),
    });

    redirect(`/${user.username}/${deck.slug}`);
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return {
        success: false,
        error: 'You already have a deck with that name or slug',
      };
    }

    throw error;
  }
};

const updateDeck = async (
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> => {
  const startedAt = performance.now();
  const user = await getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }

  const deckId = formData.get('deckId') as string;
  const name = formData.get('name') as string;
  const isPublic = formData.get('isPublic') as string;
  const rawSlug = formData.get('slug') as string;
  const slug = rawSlug?.trim() ? rawSlug.trim() : slugify({ name });

  const result = createDeckSchema.safeParse({ name, slug, isPublic });

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
    const updated = await prisma.deck.update({
      where: { id: deckId },
      data: {
        name: result.data.name,
        slug: result.data.slug,
        isPublic: result.data.isPublic,
      },
    });

    logEvent('deck.updated', {
      userId: user.userId,
      deckId: updated.id,
      durationMs: elapsedMs(startedAt),
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
        error: 'You already have a deck with that name or slug',
      };
    }

    throw error;
  }
};

const deleteDeck = async (deckId: string): Promise<ActionResult> => {
  const startedAt = performance.now();
  const user = await getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }

  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
  });

  if (!deck) {
    return { success: false, error: 'Deck not found' };
  }

  if (deck.userId !== user.userId) {
    return {
      success: false,
      error: 'You do not have permission to delete this deck',
    };
  }

  await prisma.deck.delete({ where: { id: deckId } });

  logEvent('deck.deleted', {
    userId: user.userId,
    deckId,
    durationMs: elapsedMs(startedAt),
  });

  redirect(`/${user.username}/decks`);
};

export { getUserDecks, createDeck, updateDeck, deleteDeck };
