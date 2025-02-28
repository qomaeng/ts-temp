import { default as fs } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import { default as esjs } from '@eslint/js';
import { default as esNextPlugin } from '@next/eslint-plugin-next';
import { default as esPrettierConfig } from 'eslint-config-prettier';
import { default as esImportPlugin } from 'eslint-plugin-import-x';
import { default as esJestPlugin } from 'eslint-plugin-jest';
import { default as esNodePlugin } from 'eslint-plugin-n';
import { default as esPrittierRecommended } from 'eslint-plugin-prettier/recommended';
import { default as esPromisePlugin } from 'eslint-plugin-promise';
import { default as globals } from 'globals';
import { default as tslint } from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const globalIgnores = [
  '!**/eslint.config.*',
  '!**/jest.config.*',
  '**/node_modules/**/*',
  '**/dist/**/*',
  '**/docs/**/*',
  '**/coverage/**/*',
  '.*',
  '**/.next/**/*',
  '**/next-env.d.ts',
];

// ============================================================
//                           Base
// ============================================================

const baseConfig = tslint.default.config(
  esjs.configs.recommended,
  esPrettierConfig,
  esPrittierRecommended,
  esImportPlugin.flatConfigs.recommended,
  esPromisePlugin.configs['flat/recommended'],
  {
    files: ['**/*.{js,cjs,mjs,ts,cts,mts}', '**/*.{js,cjs,mjs,ts,cts,mts}x'],
    rules: {
      'array-callback-return': ['error', { checkForEach: true }],
      'no-duplicate-imports': ['error', { includeExports: true }],
      'no-empty-pattern': ['error', { allowObjectPatternsAsParameters: true }],
      'no-fallthrough': [
        'error',
        {
          commentPattern: 'break[\\s\\w]*omitted',
          allowEmptyCase: true,
          reportUnusedFallthroughComment: true,
        },
      ],
      'no-inner-declarations': ['error', 'both', { blockScopedFunctions: 'allow' }],
      'no-promise-executor-return': 'error',
      'no-self-compare': 'error',
      'no-template-curly-in-string': 'error',
      'no-undef': ['error', { typeof: true }],
      'no-unmodified-loop-condition': 'error',
      'no-unreachable-loop': 'error',
      'no-unsafe-negation': ['error', { enforceForOrderingRelations: true }],
      'no-unsafe-optional-chaining': ['error', { disallowArithmeticOperators: true }],
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'no-use-before-define': ['error', { functions: false }],
      'no-useless-assignment': 'error',
      'require-atomic-updates': 'error',
      'use-isnan': ['error', { enforceForSwitchCase: true, enforceForIndexOf: true }],
      'valid-typeof': ['error', { requireStringLiterals: true }],
      'arrow-body-style': ['error', 'as-needed'],
      camelcase: 'off',
      'consistent-return': 'error',
      curly: 'error',
      'default-case': 'error',
      'default-case-last': 'error',
      'default-param-last': 'error',
      eqeqeq: ['error', 'always'],
      'func-names': ['error', 'as-needed'],
      'guard-for-in': 'error',
      'new-cap': [
        'error',
        {
          newIsCap: true,
          capIsNew: false,
        },
      ],
      'no-alert': 'error',
      'no-array-constructor': 'error',
      'no-caller': 'error',
      'no-case-declarations': 'error',
      'no-div-regex': 'error',
      'no-empty-function': 'error',
      'no-eq-null': 'error',
      'no-eval': 'error',
      'no-implicit-coercion': [
        'error',
        { disallowTemplateShorthand: true, allow: ['!!'] },
      ],
      'no-implicit-globals': 'error',
      'no-implied-eval': 'error',
      //
      /* Import */
      'import-x/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      //
      /* Promise */
      //'max-nested-callbacks': ['error', 3],
      //'no-return-await': 'error',
      //'prefer-promise-reject-errors': 'error',
      /* Node */
      //'n/handle-callback-err': ['error', '^(e|err|error)$'],
      //'n/no-callback-literal'
      //'n/no-sync'
    },
  },
);

// ============================================================
//                         Typescript
// ============================================================

const typescriptConfig = tslint.default.config(
  ...tslint.configs.recommended,
  esImportPlugin.flatConfigs.typescript,
  {
    rules: {
      // Handled by Typescript.
      'import-x/no-unresolved': 'off',

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/consistent-type-assertions': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'off',

      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    },
  },
);

// ============================================================
//                             Jest
// ============================================================

const jestConfigs = tslint.config(esJestPlugin.configs['flat/recommended'], {
  files: [
    '**/jest.config.{js,cjs,mjs,ts,cts,mts}',
    '**/test/**/*.{js,cjs,mjs,ts,cts,mts}',
    '**/tests/**/*.{js,cjs,mjs,ts,cts,mts}',
    '**/*.{spec,test}.{js,cjs,mjs,ts,cts,mts}',
  ],
  languageOptions: {
    globals: {
      ...globals.node,
    },
  },
});

const nodeConfigs = tslint.config(esNodePlugin.configs['flat/recommended'], {
  files: ['**/*.{js,cjs,mjs,ts,cts,mts}', '**/*.{js,cjs,mjs,ts,cts,mts}x'],
  rules: {
    'n/no-missing-import': 'off', // Duplicates `import-x/no-unresolved`
    'n/no-missing-require': 'off', // Duplicates `import-x/no-unresolved`
  },
});

// ============================================================
//                            Web
// ============================================================

const compat = new FlatCompat({
  allConfig: esNextPlugin.configs,
});

const websConfig = [
  ...tslint
    .config(
      ...compat.extends(
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@next/next/recommended',
        'plugin:@next/next/core-web-vitals',
      ),
      {
        languageOptions: {
          globals: {
            ...globals.browser,
          },
        },
      },
    )
    .map((config) => ({
      ...config,
      files: [`${__dirname}/webs/web-server`],
    })),
];

// ============================================================
//                            Apps
// ============================================================

const appPaths = fs
  .readdirSync(`${__dirname}/apps`)
  .map((path) => `${__dirname}/apps/${path}`);

const appsConfig = appPaths
  .map((path) => [
    ...tslint.config(...nodeConfigs).map((config) => ({
      ...config,
      files: [
        `${path}/**/*.{js,cjs,mjs,ts,cts,mts}`,
        `${path}/**/*.{js,cjs,mjs,ts,cts,mts}x`,
      ],
    })),
  ])
  .flat();

// ============================================================
//                          Packages
// ============================================================

const packagePaths = fs
  .readdirSync(`${__dirname}/packages`)
  .map((path) => `${__dirname}/packages/${path}`);

const packagesConfig = packagePaths.map((_path) => []).flat();

// ============================================================
//                           Export
// ============================================================

const eslintConfig = [
  ...baseConfig,
  ...typescriptConfig,
  ...jestConfigs,
  ...websConfig,
  ...appsConfig,
  ...packagesConfig,
  {
    ignores: globalIgnores,
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];

export default eslintConfig;
