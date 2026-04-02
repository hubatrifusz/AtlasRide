import sharedConfig from '@repo/eslint-config';
import vuePlugin from 'eslint-plugin-vue';
import globals from 'globals';
import vueParser from 'vue-eslint-parser';

export default [
  ...sharedConfig,
  {
    ignores: ['node_modules/**', '.output/**', '.nuxt/**'],
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ref: 'readonly',
      },
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 'latest',
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
      'vue/no-unused-vars': 'error',
    },
  },
];
