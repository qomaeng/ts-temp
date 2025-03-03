import tseslint from 'typescript-eslint';

import base_config from './base.mjs';
import node_config from './node.mjs';

export default tseslint.config(...base_config, ...node_config);
