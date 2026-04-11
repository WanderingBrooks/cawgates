/**
 * Data Access Layer (DAL)
 *
 * Centralises data fetching and authorisation checks so they cannot be separated.
 * All functions accept `ownerUsername` (from the URL) rather than inferring the
 * owner from the current session. This allows both the owner and guests to use
 * the same read path — guests are gated by `isPublic` on the deck.
 *
 * Every function returns `isOwner: boolean` so pages can conditionally render
 * edit controls without making a second auth call.
 *
 * Functions compose — e.g. `getEvent` calls `getDeck` — so the
 * `isPublic` check is enforced automatically at every level.
 *
 * Server actions do their own auth and should NOT use these functions.
 */
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/session';

const getDecksForOwner = async ({
  ownerUsername,
}: {
  ownerUsername: string;
}) => {
  const [viewer, owner] = await Promise.all([
    getUser(),
    prisma.user.findUnique({ where: { username: ownerUsername } }),
  ]);

  if (!owner) {
    notFound();
  }

  const isOwner = viewer?.userId === owner.id;

  const decks = await prisma.deck.findMany({
    where: {
      userId: owner.id,
      ...(isOwner ? {} : { isPublic: true }),
    },
    orderBy: { createdAt: 'asc' },
    include: { _count: { select: { events: true } } },
  });

  return { decks, isOwner };
};

const getDeck = async ({
  ownerUsername,
  deckSlug,
}: {
  ownerUsername: string;
  deckSlug: string;
}) => {
  const [viewer, owner] = await Promise.all([
    getUser(),
    prisma.user.findUnique({
      where: { username: ownerUsername },
      select: { id: true },
    }),
  ]);

  if (!owner) {
    notFound();
  }

  const deck = await prisma.deck.findUnique({
    where: { userId_slug: { userId: owner.id, slug: deckSlug } },
  });

  if (!deck) {
    notFound();
  }

  const isOwner = viewer?.userId === deck.userId;

  if (!isOwner && !deck.isPublic) {
    notFound();
  }

  return { deck, isOwner };
};

const getEventsForSlug = async ({
  ownerUsername,
  deckSlug,
}: {
  ownerUsername: string;
  deckSlug: string;
}) => {
  const { deck, isOwner } = await getDeck({
    ownerUsername,
    deckSlug,
  });

  const events = await prisma.event.findMany({
    where: { deckId: deck.id },
    orderBy: { date: 'desc' },
    include: { matches: true },
  });

  return { deck, events, isOwner };
};

const getEvent = async ({
  ownerUsername,
  deckSlug,
  eventId,
}: {
  ownerUsername: string;
  deckSlug: string;
  eventId: string;
}) => {
  const { deck, isOwner } = await getDeck({
    ownerUsername,
    deckSlug,
  });

  const event = await prisma.event.findUnique({
    where: { id: eventId, deckId: deck.id },
    include: {
      matches: {
        orderBy: { createdAt: 'asc' },
        include: { opponentArchetype: true },
      },
    },
  });

  if (!event) {
    notFound();
  }

  return { deck, event, isOwner };
};

const getOpponentArchetype = async ({
  ownerUsername,
  deckSlug,
  opponentArchetypeId,
}: {
  ownerUsername: string;
  deckSlug: string;
  opponentArchetypeId: string;
}) => {
  const { deck, isOwner } = await getDeck({
    ownerUsername,
    deckSlug,
  });

  const opponentArchetype = await prisma.opponentArchetype.findUnique({
    where: { id: opponentArchetypeId, deckId: deck.id },
    include: {
      matches: {
        orderBy: { event: { date: 'desc' } },
        include: { event: true },
      },
    },
  });

  if (!opponentArchetype) {
    notFound();
  }

  return { deck, opponentArchetype, isOwner };
};

const getOwnerByUsername = async ({ username }: { username: string }) => {
  const owner = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!owner) {
    notFound();
  }

  return { owner };
};

export {
  getOwnerByUsername,
  getDecksForOwner,
  getDeck,
  getEventsForSlug,
  getEvent,
  getOpponentArchetype,
};
