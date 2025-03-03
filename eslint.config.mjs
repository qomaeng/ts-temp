import tseslint from 'typescript-eslint';

import node_config from '@alli/eslint-config/node.mjs';

export default tseslint.config(
  {
    ignores: ['apps/**', 'packages/**'],
  },
  ...node_config,
);
