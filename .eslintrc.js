module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  rules: {
    'no-console': 1,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    'no-shadow': 0,
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-var-requires': 1,
    '@typescript-eslint/camelcase': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/consistent-type-definitions': 0,
    'no-param-reassign': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-shadow': 0,
    '@typescript-eslint/no-empty-interface': 0,
  },
};
