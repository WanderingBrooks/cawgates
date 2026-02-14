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
