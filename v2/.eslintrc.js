module.exports = {
    root: true,
    env: {
        node: true,
        'vue/setup-compiler-macros': true
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended', 'plugin:vue/vue3-essential', '@vue/typescript/recommended'],
    rules: {
        curly: 'error',
        semi: 'off',
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-else-return': ['error', { allowElseIf: true }],
        'arrow-parens': 'off',
        'generator-star-spacing': 'off',
        'prefer-const': 'error',
        'no-var': 'error',
        'vue/no-unused-vars': 'error',
        'vue/require-default-prop': 'off',
        'vue/custom-event-name-casing': 'off',
        'linebreak-style': 'off',
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto'
            }
        ]
        // 'graphql/template-strings': [
        //     'error',
        //     {
        //         env: 'apollo',
        //         schemaJson: require('./src/apollo/schemas/api.json')
        //         // tagName is gql by default
        //     }
        // ]
    },
    parserOptions: {
        ecmaVersion: 2020
    }
}
