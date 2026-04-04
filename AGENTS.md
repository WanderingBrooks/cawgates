# Coding Preferences

## TypeScript

- Use `type` instead of `interface` for all type definitions
- Always use `const` arrow functions instead of function declarations
- Always use braces for `if` statements — no single-line braceless ifs

```typescript
// ❌ Bad
interface User {
  name: string;
}
function greet(user: User) {}
if (!user) return;

// ✅ Good
type User = {
  name: string;
};
const greet = (user: User) => {};
if (!user) {
  return;
}
```

## Code Style

- Use objects for function parameters (improves readability and future extensibility)
- Respect the ESLint configuration

```typescript
// ❌ Bad
const calculate = (index: number, isActive: boolean) => {};

// ✅ Good
const calculate = ({
  index,
  isActive,
}: {
  index: number;
  isActive: boolean;
}) => {};
```

## UI & Styling

- Use CSS modules for styling
- **NEVER use inline `style` attribute** - always create a CSS module class
- If a component doesn't have a CSS module file, create one
- Use the `cn` util function when combining multiple classes
- Always use CSS variables from `@/app/globals.css` for colors and spacing

```tsx
// ❌ Bad - inline styles
<div style={{ color: 'red', padding: '8px' }} />
<p style={{ color: 'var(--color-error-text)' }}>{error}</p>

// ✅ Good - CSS module class
<div className={classes.container} />
<p className={classes.error}>{error}</p>
```

```tsx
// ❌ Bad - string concatenation
<div className={`${classes.input} ${className}`} />

// ✅ Good - cn function
<div className={cn(classes.input, className)} />
```

- **NEVER set `font-size`, `letter-spacing`, or other typography properties directly in CSS modules** — use reusable text utility classes from `globals.css` (e.g. `.text-label`, `.text-emphasis`) and apply them alongside module classes via `cn()`

```tsx
// ❌ Bad - typography in a CSS module
// .sectionHeader { font-size: 0.8rem; letter-spacing: 0.05em; text-transform: uppercase; }
<p className={classes.sectionHeader} />

// ✅ Good - global text utility composed with module class
<p className={cn('text-label', classes.sectionHeader)} />
```

## Internationalization

- **CRITICAL: NEVER hardcode ANY text in components**
- This includes: button labels, error messages, loading states, placeholders, aria-labels, etc.
- ALL user-facing text MUST come from `messages/en.json`
- Use `useTranslations()` hook in client components
- Use `getTranslations()` in server components
- Add new translation keys to `messages/en.json` before writing the component code

```tsx
// ❌ Bad - ANY hardcoded text is forbidden
<Button>Click me</Button>
<span>Loading...</span>
<div>Error: {error}</div>
{pending ? 'Saving...' : 'Save'}

// ✅ Good - ALL text from translations
const t = useTranslations('myComponent');
<Button>{t('clickMe')}</Button>
<span>{t('loading')}</span>
<div>{t('error')}: {error}</div>
{pending ? t('saving') : t('save')}
```

## Server Actions

- All server action return types must use `ActionResult` or `ActionResultWithData<T>` from `src/lib/types.ts` — never define new local result types in action files
- `ActionResult` is for actions that return success/failure only
- `ActionResultWithData<T>` is for actions that return data on success (e.g. `ActionResultWithData<{ id: string; name: string }>`)
- Both use a discriminated union with `error?: never` on the success branch, so `state?.error` works ergonomically in forms without additional narrowing

```typescript
// ❌ Bad - local result type
export type MyActionResult = { success: boolean; error?: string };

// ✅ Good - shared types from types.ts
import { type ActionResult, type ActionResultWithData } from '@/lib/types';
const myAction = async (): Promise<ActionResult> => { ... };
const myActionWithData = async (): Promise<ActionResultWithData<{ id: string }>> => { ... };
```

## Code Quality

- After generating or modifying code, always run both `npm run lint` and `npm run typecheck` to catch errors
- `npm run lint` catches style and ESLint rule violations
- `npm run typecheck` runs `tsc --noEmit` to catch cross-file type errors that ESLint misses

## Data Access

- **NEVER query Prisma directly in page components** — always use the Data Access Layer (`src/lib/dal.ts`)
- The DAL functions handle both data fetching and authorisation together, so they cannot be accidentally separated
- When adding a new resource, add a corresponding DAL function that verifies ownership before returning data
- If you need a new DAL function at a deeper nesting level, compose it on top of the parent-level function (e.g. `getEventForUser` calls `getArchetypeForUser` internally)

```typescript
// ❌ Bad - direct Prisma query in a page, auth check can be forgotten
const archetype = await prisma.archetype.findUnique({ where: { id: archetypeId } });
if (!archetype || archetype.userId !== user.userId) notFound();

// ✅ Good - DAL function enforces auth automatically
const { archetype } = await getArchetypeForUser({ archetypeId });
```

## File Organization

- Keep shared types in `src/lib/types.ts`
- Keep server actions in `src/app/actions/`
- Use the `'use client'` directive for client components
