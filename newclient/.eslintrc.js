module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ['plugin:vue/recommended', 'eslint:recommended', '@vue/prettier', '@vue/typescript'],
    rules: {
        curly: 'error',
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-else-return': ['error', { allowElseIf: true }],
        'arrow-parens': 'off',
        'generator-star-spacing': 'off',
        semi: 'off',
        'prefer-const': 'error',
        'no-var': 'error',
        'vue/no-unused-vars': 'error',
        'vue/require-default-prop': 'off',
        'vue/custom-event-name-casing': 'off',
        'graphql/template-strings': [
            'error',
            {
                env: 'apollo',
                schemaJson: require('./src/apollo/schemas/api.json')
                // tagName is gql by default
            }
        ]
    },
    parserOptions: {
        parser: 'typescript-eslint-parser'
    },
    plugins: ['graphql']
}
