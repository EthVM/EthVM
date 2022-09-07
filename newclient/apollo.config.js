module.exports = {
    client: {
        service: {
            name: 'api',
            url: 'https://api-v2.ethvm.dev',
            includes: ['**/*.graphql'],
            excludes: ['node_modules/**/*']
        }
    }
}
