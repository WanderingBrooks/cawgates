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
  archetypeId,
}: {
  archetypeId: string;
}) => {
  const user = await getUser();

  if (!user) {
    notFound();
  }

  const archetype = await prisma.archetype.findUnique({
    where: { id: archetypeId },
  });

  if (!archetype || archetype.userId !== user.userId) {
    notFound();
  }

  return { user, archetype };
};

const getEventForUser = async ({
  archetypeId,
  eventId,
}: {
  archetypeId: string;
  eventId: string;
}) => {
  const { user, archetype } = await getArchetypeForUser({ archetypeId });

  const event = await prisma.event.findUnique({
    where: { id: eventId, archetypeId },
    include: { matches: { orderBy: { order: 'asc' } } },
  });

  if (!event) {
    notFound();
  }

  return { user, archetype, event };
};

export { getArchetypeForUser, getEventForUser };
