import { FavToken, Query, Mutation } from './schema.graphql'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { resolvers } from './resolvers'
import store from 'store'
import { TypeName, DataArray } from './models'
import { favTokenCache_favTokens as favTokenType } from './apolloTypes/favTokenCache'

const FavTypeDef = `${FavToken} ${Query} ${Mutation}`

const favCache = new InMemoryCache()

const getLocalStorageCache = (_cache: InMemoryCache): void => {
    const tokens = store.get(DataArray.token) || []
    const tokensMap: favTokenType[] = tokens.map(item => {
        return {
            __typename: TypeName.token,
            address: item.address,
            symbol: item.symbol
        }
    })
    _cache.writeData({
        data: {
            favTokens: tokensMap
        }
    })
}
getLocalStorageCache(favCache)
/* Listen to updates on different browser Tabs */
window.addEventListener('storage', event => {
    if (event.key === DataArray.token) {
        getLocalStorageCache(favCache)
    }
})

export const FavTokClient = new ApolloClient({
    cache: favCache,
    typeDefs: FavTypeDef,
    resolvers: resolvers
})
