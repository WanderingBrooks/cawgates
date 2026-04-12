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
const RESERVED_SLUGS = ['create', 'login', 'register', 'events', 'decks'];

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
  formatter.dateTime(date, { month: 'short', day: 'numeric', year: '2-digit' });

export { cn, slugify, RESERVED_SLUGS, formatDate };
