import { FavAddress, Query, Mutation } from './schema.graphql'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { resolvers } from './resolvers'
import store from 'store'
import { TypeName, DataArray } from './models'
import { favAddressCache_favAddresses as favAddressType } from './apolloTypes/favAddressCache'

const FavTypeDef = `${FavAddress} ${Query} ${Mutation}`

const favCache = new InMemoryCache()

const getLocalStorageCache = (_cache: InMemoryCache): void => {
    const addresses = store.get(DataArray.addr) || []
    const addressMap: favAddressType[] = addresses.map(item => {
        return {
            __typename: TypeName.addr,
            address: item.address,
            name: item.name
        }
    })
    _cache.writeData({
        data: {
            favAddresses: addressMap
        }
    })
}
getLocalStorageCache(favCache)

/* Listen to updates on different browser Tabs */
window.addEventListener('storage', event => {
    if (event.key === DataArray.addr) {
        getLocalStorageCache(favCache)
    }
})

export const FavAddrClient = new ApolloClient({
    cache: favCache,
    typeDefs: FavTypeDef,
    resolvers: resolvers
})
