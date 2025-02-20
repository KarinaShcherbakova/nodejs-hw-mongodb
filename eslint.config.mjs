// import globals from 'globals';
// import pluginJs from '@eslint/js';

// export default [
//   pluginJs.configs.recommended,
//   {
//     files: ['src/**/*.js'],
//     languageOptions: { globals: globals.node },
//     rules: {
// 	    semi: 'error',
// 	    'no-unused-vars': ['error', { args: 'none' }],
// 	    'no-undef': 'error'
// 	  },
//   },
// ];


import globals from 'globals';

export default [
  {
    // Використовуємо стандартну конфігурацію ESLint
    extends: ['eslint:recommended'],
    parserOptions: {
      sourceType: 'module', // Для роботи з ES-модулями
    },
    files: ['src/**/*.js'], // Застосовуємо тільки для файлів у src
    languageOptions: {
      globals: globals.node, // Глобальні змінні для Node.js
    },
    rules: {
      semi: 'error', // Обов'язковий кінець рядка
      'no-unused-vars': ['error', { args: 'none' }], // Не дозволяти непотрібні аргументи
      'no-undef': 'error', // Не використовувати невизначені змінні
    },
  },
];
