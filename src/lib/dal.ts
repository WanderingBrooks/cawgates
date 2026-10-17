/**
 * Data Access Layer (DAL)
 *
 * Centralises data fetching and authorisation checks so they cannot be separated.
 * All functions accept `ownerUsername` (from the URL) rather than inferring the
 * owner from the current session. This allows both the owner and guests to use
 * the same read path.
 *
 * Every function returns `isOwner: boolean` so pages can conditionally render
 * edit controls without making a second auth call.
 *
 * Decks, events and matches are public. The only private data is notes, which
 * these functions blank out for anyone but the owner, so they never reach a
 * guest's browser (client components receive whole objects as props).
 *
 * Server actions do their own auth and should NOT use these functions.
 */
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/session';
import { getMatchRecord } from '@/lib/utils';

// Notes are private to their author
const hideNotes = <T extends { notes: string | null }>({
  item,
  isOwner,
}: {
  item: T;
  isOwner: boolean;
}): T => (isOwner ? item : { ...item, notes: null });

// Guests only see public decks, and the matches played with them
const getVisibleDecksWhere = ({ isOwner }: { isOwner: boolean }) =>
  isOwner ? {} : { isPublic: true };

const getVisibleMatchesWhere = ({ isOwner }: { isOwner: boolean }) =>
  isOwner ? {} : { event: { deck: { isPublic: true } } };

/**
 * Match statistics per opponent archetype in a format. With a deckId only
 * that deck's matches count, and with isPublicOnly only matches played with
 * public decks. Either way only archetypes with counted matches are
 * returned. Without both, every deck's matches count and every archetype in
 * the format is returned, including ones with no matches yet.
 *
 * This does no authorisation of its own, so it isn't exported: call it only
 * from the DAL functions below, after they have checked access to the deck
 * or format.
 */
const queryMatchStatistics = async ({
  deckId,
  formatId,
  isPublicOnly = false,
}: {
  deckId?: string;
  formatId: string;
  isPublicOnly?: boolean;
}) => {
  // Archetypes are shared by every deck in the format, so when only some
  // matches count, only return the archetypes those matches were against.
  // For guests this also keeps unplayed archetype names private.
  const countedMatches =
    deckId || isPublicOnly
      ? {
          event: {
            deckId,
            deck: isPublicOnly ? { isPublic: true } : undefined,
          },
        }
      : undefined;

  const opponentArchetypes = await prisma.opponentArchetype.findMany({
    where: {
      formatId,
      ...(countedMatches && { matches: { some: countedMatches } }),
    },
    select: {
      id: true,
      name: true,
      matches: {
        where: countedMatches,
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
    where: { userId: owner.id },
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

  return {
    isOwner,
    events: events.map(event => ({
      ...hideNotes({ item: event, isOwner }),
      matches: event.matches.map(match => hideNotes({ item: match, isOwner })),
    })),
    hasDecks: decks.length > 0,
  };
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
  // since isOwner would be true for their own username and see its notes.
  if (event.deck.userId !== owner.id) {
    notFound();
  }

  return {
    event: {
      ...hideNotes({ item: event, isOwner }),
      matches: event.matches.map(match => hideNotes({ item: match, isOwner })),
    },
    isOwner,
  };
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

  // Shows matches from every deck in the format
  const opponentArchetype = await prisma.opponentArchetype.findUnique({
    where: { id: opponentArchetypeId, format: { userId: owner.id } },
    include: {
      format: true,
      matches: {
        orderBy: { event: { date: 'desc' } },
        include: { event: { include: { deck: true } } },
      },
    },
  });

  if (!opponentArchetype) {
    notFound();
  }

  // Without a match a guest has nothing to see, and the page would otherwise
  // reveal the name of an archetype that's only in the owner's format list
  if (!isOwner && opponentArchetype.matches.length === 0) {
    notFound();
  }

  return {
    opponentArchetype: {
      ...opponentArchetype,
      matches: opponentArchetype.matches.map(match =>
        hideNotes({ item: match, isOwner }),
      ),
    },
    isOwner,
  };
};

// Only the owner can see the formats list for now
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

  const visibleMatches = getVisibleMatchesWhere({ isOwner });

  const format = await prisma.format.findUnique({
    where: { id: formatId, userId: owner.id },
    include: {
      decks: {
        where: getVisibleDecksWhere({ isOwner }),
        orderBy: { createdAt: 'asc' },
      },
      opponentArchetypes: {
        // Guests only see archetypes played with a public deck
        where: isOwner ? {} : { matches: { some: visibleMatches } },
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { matches: { where: visibleMatches } } },
        },
      },
    },
  });

  if (!format) {
    notFound();
  }

  // A format without public decks has nothing a guest may see
  if (!isOwner && format.decks.length === 0) {
    notFound();
  }

  return { format, isOwner };
};

const getFormatWithMatchStatistics = async ({
  ownerUsername,
  formatId,
  deckSlug,
}: {
  ownerUsername: string;
  formatId: string;
  deckSlug?: string;
}) => {
  const { format, isOwner } = await getFormat({ ownerUsername, formatId });

  // Only decks the viewer can see can be selected, so a guest can't filter
  // by a private deck's slug. An unknown slug falls back to all decks.
  const selectedDeck =
    format.decks.find(deck => deck.slug === deckSlug) ?? null;

  // The owner sees every archetype including unplayed ones, guests only
  // the ones played with public decks
  const { rows: matchStatistics, totals } = await queryMatchStatistics({
    formatId: format.id,
    deckId: selectedDeck?.id,
    isPublicOnly: !isOwner,
  });

  return { format, isOwner, selectedDeck, matchStatistics, totals };
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
  getFormatWithMatchStatistics,
  getDecksForOwner,
  getDeck,
  getDeckWithMatchStatistics,
  getEvents,
  getEvent,
  getOpponentArchetype,
};
