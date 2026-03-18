import perfectionist from 'eslint-plugin-perfectionist';
import stylistic from '@stylistic/eslint-plugin';

export default [
  // 1. Stylistic Rules (The "Prettier" replacement)
  {
    plugins: { '@stylistic': stylistic },
    rules: {
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
    },
  },

  // 2. Perfectionist (Auto-sorting magic)
  {
    plugins: { perfectionist },
    rules: {
      'perfectionist/sort-imports': 'error',
      'perfectionist/sort-objects': 'error',
    },
  },

  // 3. Base Logic Rules
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
    },
  },
];
