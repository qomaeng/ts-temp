import eslintPluginNext from '@next/eslint-plugin-next';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import base_config from './base.mjs';

export default tseslint.config(
  eslintPluginReact.configs.flat.recommended,
  eslintPluginReactHooks.configs['recommended-latest'],
  {
    plugins: {
      '@next/next': eslintPluginNext,
    },
    rules: {
      ...eslintPluginNext.configs['recommended'].rules,
      ...eslintPluginNext.configs['core-web-vitals'].rules,
    },
  },
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  ...base_config,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
);
