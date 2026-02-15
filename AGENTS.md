# Coding Preferences

## TypeScript

- Use `type` instead of `interface` for all type definitions
- Always use `const` arrow functions instead of function declarations

```typescript
// ❌ Bad
interface User {
  name: string;
}
function greet(user: User) {}

// ✅ Good
type User = {
  name: string;
};
const greet = (user: User) => {};
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

## File Organization

- Keep shared types in `src/lib/types.ts`
- Keep server actions in `src/app/actions/`
- Use the `'use client'` directive for client components
