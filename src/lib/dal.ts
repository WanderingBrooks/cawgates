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

const getOwnerByUsername = async ({ username }: { username: string }) => {
  const [viewer, owner] = await Promise.all([
    getUser(),
    prisma.user.findUnique({
      where: { username },
      select: { id: true },
    }),
  ]);

  if (!owner) {
    notFound();
  }

  const isOwner = viewer?.userId === owner.id;

  return { viewer, owner, isOwner };
};

const getDecksForOwner = async ({
  ownerUsername,
}: {
  ownerUsername: string;
}) => {
  const { owner, isOwner } = await getOwnerByUsername({
    username: ownerUsername,
  });

  if (!owner) {
    notFound();
  }

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
  const { owner, isOwner } = await getOwnerByUsername({
    username: ownerUsername,
  });

  if (!owner) {
    notFound();
  }

  const deck = await prisma.deck.findUnique({
    where: { userId_slug: { userId: owner.id, slug: deckSlug } },
  });

  if (!deck) {
    notFound();
  }

  if (!isOwner && !deck.isPublic) {
    notFound();
  }

  return { deck, isOwner };
};

const getEvents = async ({ ownerUsername }: { ownerUsername: string }) => {
  const { isOwner, decks } = await getDecksForOwner({ ownerUsername });

  const events = await prisma.event.findMany({
    where: { deckId: { in: decks.map(deck => deck.id) } },
    orderBy: { date: 'desc' },
    include: { matches: true, deck: true },
  });

  return { isOwner, events };
};

const getEvent = async ({
  ownerUsername,
  eventId,
}: {
  ownerUsername: string;
  eventId: string;
}) => {
  const { owner, isOwner } = await getOwnerByUsername({
    username: ownerUsername,
  });

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      deck: true,
      matches: {
        orderBy: { createdAt: 'asc' },
        include: { opponentArchetype: true },
      },
    },
  });

  if (!event) {
    notFound();
  }

  // Verify the event belongs to the profile in the URL. Without this, a logged-in
  // user could read any event by visiting /{their-own-username}/events/{any-id},
  // since isOwner would be true for their own username and bypass the public check below.
  if (event.deck.userId !== owner.id) {
    notFound();
  }

  if (!isOwner && !event.deck.isPublic) {
    notFound();
  }

  return { event, isOwner };
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

export {
  getOwnerByUsername,
  getDecksForOwner,
  getDeck,
  getEvents,
  getEvent,
  getOpponentArchetype,
};
