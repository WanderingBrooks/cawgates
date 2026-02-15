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
const calculate = ({ index, isActive }: { index: number; isActive: boolean }) => {};
```

## UI & Styling

- Use CSS modules for styling
- Use the `cn` util function when combining multiple classes
- Always use CSS variables from `@/app/globals.css` for colors and spacing

```tsx
// ❌ Bad - string concatenation
<div className={`${classes.input} ${className}`} />

// ✅ Good - cn function
<div className={cn(classes.input, className)} />
```

## Internationalization

- **Never hardcode text directly in components**
- Always use translations from `messages/en.json`
- Use `useTranslations()` hook in client components
- Use `getTranslations()` in server components
- Add new translation keys to `messages/en.json` when adding text to the UI

```tsx
// ❌ Bad - hardcoded text
<Button>Click me</Button>

// ✅ Good - using translations
const t = useTranslations('myComponent');
<Button>{t('clickMe')}</Button>
```

## File Organization

- Keep shared types in `src/lib/types.ts`
- Keep server actions in `src/app/actions/`
- Use the `'use client'` directive for client components
