import tseslint from 'typescript-eslint';

import nest_config from '@alli/eslint-config/nest.mjs';

export default tseslint.config(...nest_config, {
  languageOptions: {
    ecmaVersion: 2023,
    sourceType: 'module',
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
