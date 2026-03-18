import sharedConfig from '@repo/eslint-config';
import vuePlugin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  ...sharedConfig,

  {
    ignores: ['node_modules/**', '.nuxt/**'],
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
      },
    },
    plugins: {
      vue: vuePlugin,
    },
    rules: {
      'no-console': 'off',
      'no-var': 'error',
      'prefer-const': 'error',
      'vue/attributes-order': [
        'error',
        {
          alphabetical: false,
        },
      ],
      'vue/no-unused-vars': 'error',
    },
  },
);
