// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import vuePlugin from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default withNuxt(
  // Ignore patterns (replaces .eslintignore for flat config)
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.nuxt/**',
      '.output/**',
      'coverage/**',
      'public/**',
      '*.min.js',
      '.git/**',
    ],
  },
  {
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
    'no-console': 'warn',
    'vue/attributes-order': [
      'error',
      {
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          ['UNIQUE', 'SLOT'],
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT',
        ],
        alphabetical: false,
      },
    ],
    'vue/multi-word-component-names': 'off',
  },
}).append(eslintConfigPrettier)
