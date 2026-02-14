# Coding Preferences

## TypeScript

- Use `type` instead of `interface` for all type definitions
- Always use `const` arrow functions instead of function declarations

## Code Style

- Use const arrow functions: `const MyComponent = () => {}`
- Respect the ESLint configuration
- Always use objects for function parameters. Prefer `({ index }: { index: number }) => {}` over `(index: number) => {}`

## UI & Styling

- Use CSS modules for stylin
- When giving an element multiple classes uses the cn util function, instead of combing the classes in a string. Prefer `className={cn(lasses.input, className)}` over `className={`${classes.input} ${className}`}`
- Always use css variables in `@/app/globals.css` for colors and spacing.

## File Organization

- Keep shared types in `src/lib/types.ts`
- Keep server actions in `src/app/actions/`
- Use the `'use client'` directive for client components
