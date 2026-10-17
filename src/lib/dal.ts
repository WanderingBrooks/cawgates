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
import { getMatchRecord } from '@/lib/utils';

/**
 * Match statistics per opponent archetype in a format. With a deckId only
 * that deck's matches count, and only archetypes it has played are
 * returned. Without one, every deck's matches count and every archetype
 * in the format is returned, including ones with no matches yet.
 *
 * This does no authorisation of its own, so it isn't exported: call it only
 * from the DAL functions below, after they have checked access to the deck
 * or format.
 */
const queryMatchStatistics = async ({
  deckId,
  formatId,
}: {
  deckId?: string;
  formatId: string;
}) => {
  // Archetypes are shared by every deck in the format, so for a deck only
  // count the archetypes and matches it has actually played
  const deckMatches = deckId ? { event: { deckId } } : undefined;

  const opponentArchetypes = await prisma.opponentArchetype.findMany({
    where: {
      formatId,
      ...(deckMatches && { matches: { some: deckMatches } }),
    },
    select: {
      id: true,
      name: true,
      matches: {
        where: deckMatches,
        select: { wins: true, losses: true },
      },
    },
  });

  const deckStats = opponentArchetypes.map(opponentArchetype => {
    const { wins, losses, matchWins, matchLosses, matchDraws } = getMatchRecord(
      { matches: opponentArchetype.matches },
    );

    const total = wins + losses;

    return {
      opponentArchetype: opponentArchetype.name,
      opponentArchetypeId: opponentArchetype.id,
      totalMatches: opponentArchetype.matches.length,
      total,
      wins,
      losses,
      winRate: total === 0 ? 0 : wins / total,
      matchWins,
      matchLosses,
      matchDraws,
    };
  });

  // Sort order:
  // 1) Total games played (wins + losses) descending — more data first.
  // 2) Win rate descending for ties in total games (wins/total).
  // 3) Alphabetical ascending fallback for deterministic ordering.
  const rows = deckStats.sort((a, b) => {
    if (b.total !== a.total) {
      return b.total - a.total;
    }

    if (b.winRate !== a.winRate) {
      return b.winRate - a.winRate;
    }

    return a.opponentArchetype.localeCompare(b.opponentArchetype);
  });

  const { matchWins, matchLosses, matchDraws } = getMatchRecord({
    matches: opponentArchetypes.flatMap(
      opponentArchetype => opponentArchetype.matches,
    ),
  });

  const totalMatches = matchWins + matchLosses + matchDraws;

  return {
    rows,
    totals: {
      matchWins,
      matchLosses,
      matchDraws,
      totalMatches,
      matchWinRate: totalMatches === 0 ? 0 : matchWins / totalMatches,
    },
  };
};

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
    include: { _count: { select: { events: true } }, format: true },
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

  const deckWithCount = await prisma.deck.findUnique({
    where: { userId_slug: { userId: owner.id, slug: deckSlug } },
    include: {
      format: true,
      // Events that have at least one match, so hasMatches needs no extra query
      _count: { select: { events: { where: { matches: { some: {} } } } } },
    },
  });

  if (!deckWithCount) {
    notFound();
  }

  if (!isOwner && !deckWithCount.isPublic) {
    notFound();
  }

  const { _count, ...deck } = deckWithCount;

  return { deck, isOwner, hasMatches: _count.events > 0 };
};

const getEvents = async ({ ownerUsername }: { ownerUsername: string }) => {
  const { isOwner, decks } = await getDecksForOwner({ ownerUsername });

  const events = await prisma.event.findMany({
    where: { deckId: { in: decks.map(deck => deck.id) } },
    orderBy: { date: 'desc' },
    include: { matches: true, deck: true },
  });

  return { isOwner, events, hasDecks: decks.length > 0 };
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
  opponentArchetypeId,
}: {
  ownerUsername: string;
  opponentArchetypeId: string;
}) => {
  const { owner, isOwner } = await getOwnerByUsername({
    username: ownerUsername,
  });

  // Shows matches from every deck in the format. Guests only see matches
  // played with public decks.
  const opponentArchetype = await prisma.opponentArchetype.findUnique({
    where: { id: opponentArchetypeId, format: { userId: owner.id } },
    include: {
      format: true,
      matches: {
        where: isOwner ? {} : { event: { deck: { isPublic: true } } },
        orderBy: { event: { date: 'desc' } },
        include: { event: { include: { deck: true } } },
      },
    },
  });

  if (!opponentArchetype) {
    notFound();
  }

  // Without a public match a guest has nothing to see, and the page would
  // otherwise reveal the archetype's name
  if (!isOwner && opponentArchetype.matches.length === 0) {
    notFound();
  }

  return { opponentArchetype, isOwner };
};

// Formats have no public flag, so only the owner can see the formats pages
const getFormatsForOwner = async ({
  ownerUsername,
}: {
  ownerUsername: string;
}) => {
  const { owner, isOwner } = await getOwnerByUsername({
    username: ownerUsername,
  });

  if (!isOwner) {
    notFound();
  }

  const formats = await prisma.format.findMany({
    where: { userId: owner.id },
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { decks: true, opponentArchetypes: true } },
      // Every match is against an archetype in its format, so this covers
      // all of the format's matches
      opponentArchetypes: {
        select: { matches: { select: { wins: true, losses: true } } },
      },
    },
  });

  return { formats };
};

const getFormat = async ({
  ownerUsername,
  formatId,
}: {
  ownerUsername: string;
  formatId: string;
}) => {
  const { owner, isOwner } = await getOwnerByUsername({
    username: ownerUsername,
  });

  if (!isOwner) {
    notFound();
  }

  const format = await prisma.format.findUnique({
    where: { id: formatId, userId: owner.id },
    include: {
      decks: { orderBy: { createdAt: 'asc' } },
      opponentArchetypes: {
        orderBy: { name: 'asc' },
        include: { _count: { select: { matches: true } } },
      },
    },
  });

  if (!format) {
    notFound();
  }

  // Every deck's matches, and every archetype including unplayed ones
  const { rows: matchStatistics } = await queryMatchStatistics({
    formatId: format.id,
  });

  return { format, matchStatistics };
};

const getDeckWithMatchStatistics = async ({
  ownerUsername,
  deckSlug,
}: {
  ownerUsername: string;
  deckSlug: string;
}) => {
  const { deck, isOwner } = await getDeck({ ownerUsername, deckSlug });

  const { rows: matchStatistics, totals } = await queryMatchStatistics({
    deckId: deck.id,
    formatId: deck.formatId,
  });

  return { deck, isOwner, matchStatistics, totals };
};

export {
  getOwnerByUsername,
  getFormatsForOwner,
  getFormat,
  getDecksForOwner,
  getDeck,
  getDeckWithMatchStatistics,
  getEvents,
  getEvent,
  getOpponentArchetype,
};
