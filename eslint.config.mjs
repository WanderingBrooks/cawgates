import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  prettierConfig,

  {
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'FunctionDeclaration',
          message:
            'Use `const` with arrow functions instead of `function` declarations.',
        },
        {
          selector:
            'ExportNamedDeclaration[declaration.type="VariableDeclaration"]',
          message:
            'Inline exports are not allowed. Export separately at the end of the file.',
        },
        {
          selector:
            'ExportNamedDeclaration[declaration.type="FunctionDeclaration"]',
          message:
            'Inline exports are not allowed. Export separately at the end of the file.',
        },
        {
          selector:
            'ExportNamedDeclaration[declaration.type="ClassDeclaration"]',
          message:
            'Inline exports are not allowed. Export separately at the end of the file.',
        },
        // Archetypes have a compound unique index on (userId, slug). When querying
        // by slug you must always include userId to avoid cross-user data leaks.
        // prisma.archetype.findUnique with the userId_slug key already enforces
        // this at the TypeScript level. findFirst/findFirstOrThrow bypass that
        // constraint, so they are banned on the archetype model.
        {
          selector:
            "CallExpression[callee.type='MemberExpression'][callee.object.type='MemberExpression'][callee.object.object.name='prisma'][callee.object.property.name='archetype'][callee.property.name=/^findFirst/]",
          message:
            'Do not use prisma.archetype.findFirst/findFirstOrThrow. Use prisma.archetype.findUnique with the userId_slug compound key ({ userId_slug: { userId, slug } }) to ensure ownership is always checked when querying by slug.',
        },
      ],
      // New line between multi line blocks
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: [
            'multiline-block-like',
            'multiline-const',
            'multiline-expression',
            'multiline-let',
            'multiline-var',
            'block-like',
          ],
          next: '*',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: [
            'multiline-block-like',
            'multiline-const',
            'multiline-expression',
            'multiline-let',
            'multiline-var',
            'block-like',
          ],
        },
        {
          blankLine: 'any',
          prev: ['cjs-import', 'import'],
          next: ['cjs-import', 'import'],
        },
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'process',
          property: 'env',
          message:
            'Do not access environment variables from process.env. Import them from /lib/env.',
        },
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/components/Page',
              message:
                'Importing Page is disallowed except from the root layout (src/app/layout.tsx).',
            },
          ],
        },
      ],
    },
  },

  {
    files: ['**/page.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/components/Page',
              message:
                'Importing Page is disallowed except from the root layout (src/app/layout.tsx).',
            },
            {
              name: '@/lib/prisma',
              message:
                'Page components must not import Prisma directly. Use the Data Access Layer (@/lib/dal.ts) instead.',
            },
          ],
        },
      ],
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
