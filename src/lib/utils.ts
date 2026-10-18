import type { createFormatter } from 'use-intl/core';

// Utility function for combining classnames
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Converts a string into a URL-friendly slug.
 * Only allows letters, numbers, and hyphens.
 * Example: "My Deck Name" -> "my-deck-name"
 */
const slugify = ({ name }: { name: string }) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// Slugs that conflict with static routes
const RESERVED_SLUGS = [
  'create',
  'login',
  'register',
  'events',
  'decks',
  'matchups',
  'opponents',
];

/**
 * Formats a date consistently across the app.
 * Use this instead of calling formatter.dateTime() directly.
 */
const formatDate = ({
  formatter,
  date,
}: {
  formatter: ReturnType<typeof createFormatter>;
  date: Date;
}) =>
  // eslint-disable-next-line no-restricted-syntax
  formatter.dateTime(date, { dateStyle: 'medium' });

// Event and match notes get a tall box, since they can run long
const NOTES_ROWS = 25;

// Below this many matches a win rate says more about luck than the
// matchup, so it isn't tinted
const MIN_MATCHES_FOR_TINT = 3;

/**
 * Global class that tints a win rate cell blue (above 50%) or orange
 * (below 50%). Returns undefined for even win rates and small samples.
 */
const getWinRateTint = ({
  winRate,
  matchCount,
}: {
  winRate: number;
  matchCount: number;
}) => {
  if (matchCount < MIN_MATCHES_FOR_TINT || winRate === 0.5) {
    return undefined;
  }

  return winRate > 0.5 ? 'tint-win' : 'tint-loss';
};

/**
 * Global class that tints a single match's game record by its result:
 * blue for a win, orange for a loss and nothing for a draw.
 */
const getMatchResultTint = ({
  wins,
  losses,
}: {
  wins: number;
  losses: number;
}) => {
  if (wins === losses) {
    return undefined;
  }

  return wins > losses ? 'tint-win' : 'tint-loss';
};

/**
 * Sums a list of matches into a game record (wins, losses) and a match
 * record (matchWins, matchLosses, matchDraws). A match is won by whoever
 * won more games; equal games count as a draw.
 */
const getMatchRecord = ({
  matches,
}: {
  matches: { wins: number; losses: number }[];
}) =>
  matches.reduce<{
    wins: number;
    losses: number;
    matchWins: number;
    matchLosses: number;
    matchDraws: number;
  }>(
    (record, match) => ({
      wins: record.wins + match.wins,
      losses: record.losses + match.losses,
      matchWins: record.matchWins + (match.wins > match.losses ? 1 : 0),
      matchLosses: record.matchLosses + (match.losses > match.wins ? 1 : 0),
      matchDraws: record.matchDraws + (match.wins === match.losses ? 1 : 0),
    }),
    { wins: 0, losses: 0, matchWins: 0, matchLosses: 0, matchDraws: 0 },
  );

export {
  cn,
  slugify,
  RESERVED_SLUGS,
  NOTES_ROWS,
  formatDate,
  getWinRateTint,
  getMatchResultTint,
  getMatchRecord,
};
