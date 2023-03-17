import { isAPIExceptionProduction, isAPIExceptionDev } from './../errorExceptions'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import * as Sentry from '@sentry/vue'

/*
  ===================================================================================
    ENS
  ===================================================================================
*/

const httpLink = createHttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens'
})

// eslint-disable-next-line
const onErrorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) => {
            const loc = JSON.stringify(locations, null, 2)
            const op = JSON.stringify(operation, null, 2)
            const newError = `[GraphQL error]: Message: ${message}, \nLocation: ${loc}, \nPath: ${path}, \nOperation: ${op}`
            //For production and staging emit to Sentry:
            if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
                if (!isAPIExceptionProduction(message)) {
                    Sentry.captureException(newError)
                }
            } else {
                //For Development use only console errors:
                if (!isAPIExceptionDev(message)) {
                    // eslint-disable-next-line
                    console.log(newError)
                }
            }
        })
    }
})
const link = onErrorLink.concat(httpLink)

const cache = new InMemoryCache({})

export const EnsClient = new ApolloClient({
    link,
    cache
})
