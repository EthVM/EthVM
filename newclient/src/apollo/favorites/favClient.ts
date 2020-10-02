import { FavAddress, Query, Mutation } from './schema.graphql'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { resolvers } from './resolvers'
import store from 'store'
import { TypeName, DataArray } from './models'
import { favAddressCache_favAddresses as favAddressType } from './apolloTypes/favAddressCache'

const FavTypeDef = `${FavAddress} ${Query} ${Mutation}`

const favCache = new InMemoryCache()

const addresses = store.get(DataArray.addr) || []

const addressMap: favAddressType[] = addresses.map(item => {
    return {
        __typename: TypeName.addr,
        address: item.address,
        name: item.name
    }
})
console.log('addresses', addresses)

favCache.writeData({
    data: {
        favAddresses: addressMap
    }
})

//  client
export const FavClient = new ApolloClient({
    cache: favCache,
    typeDefs: FavTypeDef,
    resolvers: resolvers
})
