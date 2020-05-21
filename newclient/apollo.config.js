module.exports = {
    client: {
        service: {
            name: 'api',
            url: process.env.VUE_APP_HTTP_LINK,
            includes: ['**/*.graphql'],
            excludes: ['node_modules/**/*']
        }
    }
}
