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

/**
 * Match statistics per opponent archetype in a format. With a deckId only
 * that deck's matches count. With a deckId or isPlayedOnly only archetypes
 * with counted matches are returned. Without either, every deck's matches
 * count and every archetype in the format is returned, including ones with
 * no matches yet.
 *
 * This does no authorisation of its own, so it isn't exported: call it only
 * from the DAL functions below, after they have checked access to the deck
 * or format.
 */
const queryMatchStatistics = async ({
  deckId,
  formatId,
  isPlayedOnly = false,
}: {
  deckId?: string;
  formatId: string;
  isPlayedOnly?: boolean;
}) => {
  // Archetypes are shared by every deck in the format, so when only some
  // matches count, only return the archetypes those matches were against.
  // For guests this also keeps unplayed archetype names private.
  const countedMatches =
    deckId || isPlayedOnly ? { event: { deckId } } : undefined;

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
    const { matchWins, matchLosses, matchDraws } = getMatchRecord({
      matches: opponentArchetype.matches,
    });

    const totalMatches = opponentArchetype.matches.length;

    return {
      opponentArchetype: opponentArchetype.name,
      opponentArchetypeId: opponentArchetype.id,
      totalMatches,
      matchWins,
      matchLosses,
      matchDraws,
      matchWinRate: totalMatches === 0 ? 0 : matchWins / totalMatches,
    };
  });

  // Sort order:
  // 1) Matches played descending — more data first.
  // 2) Match win rate descending for ties in matches played.
  // 3) Alphabetical ascending fallback for deterministic ordering.
  const rows = deckStats.sort((a, b) => {
    if (b.totalMatches !== a.totalMatches) {
      return b.totalMatches - a.totalMatches;
    }

    if (b.matchWinRate !== a.matchWinRate) {
      return b.matchWinRate - a.matchWinRate;
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

// Composed on getEvent, so the match's event must belong to the profile
const getMatch = async ({
  ownerUsername,
  eventId,
  matchId,
}: {
  ownerUsername: string;
  eventId: string;
  matchId: string;
}) => {
  const { event, isOwner } = await getEvent({ ownerUsername, eventId });

  const match = event.matches.find(match => match.id === matchId);

  if (!match) {
    notFound();
  }

  return { event, match, isOwner };
};

const getOpponentArchetype = async ({
  ownerUsername,
  opponentArchetypeId,
  deckSlug,
}: {
  ownerUsername: string;
  opponentArchetypeId: string;
  deckSlug?: string;
}) => {
  const { owner, isOwner } = await getOwnerByUsername({
    username: ownerUsername,
  });

  // Shows matches from every deck in the format
  const opponentArchetype = await prisma.opponentArchetype.findUnique({
    where: { id: opponentArchetypeId, format: { userId: owner.id } },
    include: {
      format: {
        include: {
          // Only decks that have played this archetype can be filtered by
          decks: {
            where: {
              events: {
                some: { matches: { some: { opponentArchetypeId } } },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      },
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

  // Before the deck filter, since any match blocks deleting the archetype
  const hasMatches = opponentArchetype.matches.length > 0;

  // Only decks that played the archetype can be selected, and any other slug
  // falls back to all decks
  const { decks } = opponentArchetype.format;
  const selectedDeck = decks.find(deck => deck.slug === deckSlug) ?? null;

  const matches = selectedDeck
    ? opponentArchetype.matches.filter(
        match => match.event.deckId === selectedDeck.id,
      )
    : opponentArchetype.matches;

  return {
    opponentArchetype: {
      ...opponentArchetype,
      matches: matches.map(match => ({
        ...hideNotes({ item: match, isOwner }),
        event: hideNotes({ item: match.event, isOwner }),
      })),
    },
    decks,
    selectedDeck,
    hasMatches,
    isOwner,
  };
};

// Every format, most played first
const getFormatsForOwner = async ({
  ownerUsername,
}: {
  ownerUsername: string;
}) => {
  const { owner, isOwner } = await getOwnerByUsername({
    username: ownerUsername,
  });

  const formats = await prisma.format.findMany({
    where: { userId: owner.id },
    select: {
      id: true,
      name: true,
      // Every match is against an archetype in its format, so this covers
      // all of the format's matches
      opponentArchetypes: {
        select: {
          _count: { select: { matches: true } },
        },
      },
    },
  });

  const formatsWithMatchCount = formats
    .map(({ opponentArchetypes, ...format }) => ({
      ...format,
      matchCount: opponentArchetypes.reduce(
        (sum, opponentArchetype) => sum + opponentArchetype._count.matches,
        0,
      ),
    }))
    // Alphabetical when tied
    .sort((a, b) => {
      if (b.matchCount !== a.matchCount) {
        return b.matchCount - a.matchCount;
      }

      return a.name.localeCompare(b.name);
    });

  return { formats: formatsWithMatchCount, isOwner };
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

  const format = await prisma.format.findUnique({
    where: { id: formatId, userId: owner.id },
    include: {
      decks: { orderBy: { createdAt: 'asc' } },
      opponentArchetypes: { orderBy: { name: 'asc' } },
    },
  });

  if (!format) {
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

  // An unknown slug falls back to all decks
  const selectedDeck =
    format.decks.find(deck => deck.slug === deckSlug) ?? null;

  // The owner sees every archetype including unplayed ones, guests only the
  // played ones, the same as the opponent archetype page
  const { rows: matchStatistics, totals } = await queryMatchStatistics({
    formatId: format.id,
    deckId: selectedDeck?.id,
    isPlayedOnly: !isOwner,
  });

  return { format, isOwner, selectedDeck, matchStatistics, totals };
};

export {
  getOwnerByUsername,
  getFormatsForOwner,
  getFormat,
  getFormatWithMatchStatistics,
  getDecksForOwner,
  getDeck,
  getEvents,
  getEvent,
  getMatch,
  getOpponentArchetype,
};
