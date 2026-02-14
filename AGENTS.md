# Coding Preferences

## TypeScript

- Use `type` instead of `interface` for all type definitions
- Always use `const` arrow functions instead of function declarations

## Code Style

- Use const arrow functions: `const MyComponent = () => {}`
- Respect the ESLint configuration

## UI & Styling

- Use Tailwind CSS utilities for styling
- Use Shadcn/ui components when available
- Import Shadcn/ui components from `@/components/ui/`

## File Organization

- Keep shared types in `src/lib/types.ts`
- Keep server actions in `src/app/actions/`
- Use the `'use client'` directive for client components
