module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    semi: ['error', 'always', { omitLastInOneLineBlock: false }], // Это чтобы выдавало ошибку когда нет точки с запятой и при сохраниние авто вставлялись
    // 'comma-dangle': ['error', 'never'],
    quotes: ['error', 'single'], // Для того чтобы везде были одинарные ковычки
    'react/prop-types': [0], // чтобы пропсы не горели красными
    // 'indent': ['error', 'tab']
  },
};
