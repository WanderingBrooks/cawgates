/**
 * Data Access Layer (DAL)
 *
 * Centralises data fetching and authorisation checks so they cannot be separated.
 * Each function fetches the requested resource and verifies the current user is
 * allowed to access it, calling `notFound()` if not. Functions compose — e.g.
 * `getEventForUser` builds on `getArchetypeForUser` — so ownership is enforced
 * at every level automatically.
 *
 * All page components should use these functions instead of querying Prisma directly.
 */
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/session';

const getArchetypeForUser = async ({
  archetypeSlug,
}: {
  archetypeSlug: string;
}) => {
  const user = await getUser();

  if (!user) {
    notFound();
  }

  const archetype = await prisma.archetype.findUnique({
    where: { userId_slug: { userId: user.userId, slug: archetypeSlug } },
  });

  if (!archetype) {
    notFound();
  }

  return { user, archetype };
};

const getEventForUser = async ({
  archetypeSlug,
  eventId,
}: {
  archetypeSlug: string;
  eventId: string;
}) => {
  const { user, archetype } = await getArchetypeForUser({ archetypeSlug });

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

  return { user, archetype, event };
};

const getEventsForArchetype = async ({
  archetypeSlug,
}: {
  archetypeSlug: string;
}) => {
  const { user, archetype } = await getArchetypeForUser({ archetypeSlug });

  const events = await prisma.event.findMany({
    where: { archetypeId: archetype.id },
    orderBy: { date: 'desc' },
    include: { matches: true },
  });

  return { user, archetype, events };
};

const getOpponentArchetypeForUser = async ({
  archetypeSlug,
  opponentArchetypeId,
}: {
  archetypeSlug: string;
  opponentArchetypeId: string;
}) => {
  const { user, archetype } = await getArchetypeForUser({ archetypeSlug });

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

  return { user, archetype, opponentArchetype };
};

export {
  getArchetypeForUser,
  getEventsForArchetype,
  getEventForUser,
  getOpponentArchetypeForUser,
};
