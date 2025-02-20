import globals from 'globals';

export default [
  {
    extends: ['eslint:recommended'],
    parserOptions: {
      sourceType: 'module',
    },
    files: ['src/**/*.js'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      semi: 'error',
      'no-unused-vars': ['error', { args: 'none' }],
      'no-undef': 'error',
    },
  },
];
