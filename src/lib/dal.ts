/**
 * Data Access Layer (DAL)
 *
 * Centralises data fetching and authorisation checks so they cannot be separated.
 * All functions accept `ownerUsername` (from the URL) rather than inferring the
 * owner from the current session. This allows both the owner and guests to use
 * the same read path — guests are gated by `isPublic` on the archetype.
 *
 * Every function returns `isOwner: boolean` so pages can conditionally render
 * edit controls without making a second auth call.
 *
 * Functions compose — e.g. `getEvent` calls `getArchetype` — so the
 * `isPublic` check is enforced automatically at every level.
 *
 * Server actions do their own auth and should NOT use these functions.
 */
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/session';

const getArchetypesForOwner = async ({
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

  const archetypes = await prisma.archetype.findMany({
    where: {
      userId: owner.id,
      ...(isOwner ? {} : { isPublic: true }),
    },
    orderBy: { createdAt: 'asc' },
    include: { _count: { select: { events: true } } },
  });

  return { archetypes, isOwner };
};

const getArchetype = async ({
  ownerUsername,
  archetypeSlug,
}: {
  ownerUsername: string;
  archetypeSlug: string;
}) => {
  const [viewer, owner] = await Promise.all([
    getUser(),
    prisma.user.findUnique({ where: { username: ownerUsername }, select: { id: true } }),
  ]);

  if (!owner) {
    notFound();
  }

  const archetype = await prisma.archetype.findUnique({
    where: { userId_slug: { userId: owner.id, slug: archetypeSlug } },
  });

  if (!archetype) {
    notFound();
  }

  const isOwner = viewer?.userId === archetype.userId;

  if (!isOwner && !archetype.isPublic) {
    notFound();
  }

  return { archetype, isOwner };
};

const getEvents = async ({
  ownerUsername,
  archetypeSlug,
}: {
  ownerUsername: string;
  archetypeSlug: string;
}) => {
  const { archetype, isOwner } = await getArchetype({
    ownerUsername,
    archetypeSlug,
  });

  const events = await prisma.event.findMany({
    where: { archetypeId: archetype.id },
    orderBy: { date: 'desc' },
    include: { matches: true },
  });

  return { archetype, events, isOwner };
};

const getEvent = async ({
  ownerUsername,
  archetypeSlug,
  eventId,
}: {
  ownerUsername: string;
  archetypeSlug: string;
  eventId: string;
}) => {
  const { archetype, isOwner } = await getArchetype({
    ownerUsername,
    archetypeSlug,
  });

  const event = await prisma.event.findUnique({
    where: { id: eventId, archetypeId: archetype.id },
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

  return { archetype, event, isOwner };
};

const getOpponentArchetype = async ({
  ownerUsername,
  archetypeSlug,
  opponentArchetypeId,
}: {
  ownerUsername: string;
  archetypeSlug: string;
  opponentArchetypeId: string;
}) => {
  const { archetype, isOwner } = await getArchetype({
    ownerUsername,
    archetypeSlug,
  });

  const opponentArchetype = await prisma.opponentArchetype.findUnique({
    where: { id: opponentArchetypeId, archetypeId: archetype.id },
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

  return { archetype, opponentArchetype, isOwner };
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
  getArchetypesForOwner,
  getArchetype,
  getEvents,
  getEvent,
  getOpponentArchetype,
};
