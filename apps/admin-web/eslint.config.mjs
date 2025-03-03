import tseslint from 'typescript-eslint';

import next_config from '@alli/eslint-config/next.mjs';

export default tseslint.config(...next_config, {
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
