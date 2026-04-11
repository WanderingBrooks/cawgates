// Utility function for combining classnames
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Converts a string into a URL-friendly slug.
 * Only allows letters, numbers, and hyphens.
 * Example: "My Archetype Name" -> "my-archetype-name"
 */
const slugify = ({ name }: { name: string }) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const RESERVED_SLUGS = ['events', 'archetypes', 'create'];

export { cn, slugify, RESERVED_SLUGS };
