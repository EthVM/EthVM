module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'plugin:vue/strongly-recommended', '@vue/prettier', '@vue/typescript'],
  rules: {
    curly: 'error',
    'no-console': 'error',
    'no-debugger': 'error',
    'no-else-return': ['error', { allowElseIf: true }],
    'arrow-parens': 'off',
    'generator-star-spacing': 'off',
    semi: 'off',
    'prefer-const': 'error',
    'no-var': 'error',
    'vue/no-unused-vars': 'error',
    'vue/require-default-prop': 'off'
  },
  parserOptions: {
    parser: 'typescript-eslint-parser'
  }
}
