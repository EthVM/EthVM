/* Apolo:  */
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { RetryLink } from 'apollo-link-retry'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import VueApollo from 'vue-apollo'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { onError } from 'apollo-link-error'
import { OpenSeaClient } from './opensea/osClient'
import { FavAddrClient } from './favorite-addresses/favAddrClient'
import { FavTokClient } from './favorite-tokens/favTokenClient'
import { LocalStoreClient } from './local-store-global/localStoreClient'
import { EthBlocksClient } from './eth-blocks/ethBlocksClient'
import { ContractsClient } from './contract-verify/contractsClient'
import configs from '../configs'
import * as Sentry from '@sentry/browser'
import { isAPIExceptionProduction, isAPIExceptionDev } from './exceptions/errorExceptions'

/*
  ===================================================================================
    APIs: Apollo (GraphQL)
  ===================================================================================
*/

const httpLink = new HttpLink({
    uri: configs.APOLLO_HTTP
})

const subscriptionClient = new SubscriptionClient(configs.APOLLO_WS, { lazy: true, reconnect: true }, null, [])

const wsLink = new WebSocketLink(subscriptionClient)

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
                    console.log(newError)
                }
            }
        })
    }
})
const retry = new RetryLink({
    delay: {
        initial: 500,
        max: 5000,
        jitter: true
    },
    attempts: {
        max: 10,
        retryIf: (error, _operation) => (error && error.message ? error.message.includes('Failed to fetch') : false)
    }
})
const link = retry.split(
    // split based on operation type
    ({ query }) => {
        const definition = getMainDefinition(query)
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink,
    onErrorLink.concat(httpLink)
)

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
    link,
    cache,
    connectToDevTools: configs.NODE_ENV === 'development'
})

export const apolloProvider = new VueApollo({
    clients: {
        apolloClient,
        OpenSeaClient,
        FavAddrClient,
        FavTokClient,
        LocalStoreClient,
        EthBlocksClient,
        ContractsClient
    },
    defaultClient: apolloClient
})
