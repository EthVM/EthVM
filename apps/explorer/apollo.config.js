module.exports = {

    client: {

        service: {
            name: 'api',
            url: 'http://api:3000/graphql',
            includes: ['**/*.graphql.ts'],
            excludes: ['node_modules/**']
        }

    }

};
