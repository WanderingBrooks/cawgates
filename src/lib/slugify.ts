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

export { slugify };
