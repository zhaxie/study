module.exports = {
  globals: {
    require: true,
    process: true,
    module: true,
  },
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      js: true,
      experimentalObjectRestSpread: true,
    },
    ecmaVersion: 10,
    sourceType: 'module',
  },
  parser: 'babel-eslint',
  settings: {
    react: {
      version: 'detect',
    },
    'eslint.options': {
      experimentalDecorators: true,
    },
  },
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        singleQuote: true,
        semi: false,
        eslintIntegration: true,
      },
    ],
    // airbnb
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    // 'linebreak-style': ['error', 'windows'],
    'no-async-promise-executor': ['off'],
    'no-mixed-spaces-and-tabs': ['warn', 'smart-tabs'],
    'react/prop-types': ['off'],
    'no-empty': ['error', { allowEmptyCatch: true }],
    camelcase: ['off'],
    'no-nested-ternary': ['warn'],
    'no-plusplus': ['off'],
    radix: ['off'],
    'prefer-promise-reject-errors': ['warn', { allowEmptyReject: true }],
    'no-trailing-spaces': [
      'error',
      { skipBlankLines: true, ignoreComments: true },
    ],
    'comma-dangle': ['error', 'only-multiline'],
    'class-methods-use-this': ['warn'],
    semi: ['error', 'never'],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
}
