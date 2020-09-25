import { InMemoryCache } from 'apollo-cache-inmemory'
import { getFavAddresses } from './schema.graphql'
import { favAddressCache } from './rootQuery.graphql'
import { TypeName, DataArray } from './models'
import store from 'store'
import { favAddressCache as cachedAdrsType, favAddressCache_favAddresses as AddrType } from './apolloTypes/favAddressCache'

enum Actions {
    add = 'addItem',
    edit = 'editItem',
    delete = 'deleteItem'
}
export const resolvers = {
    Query: {
        checkAddress: (root, { address }, { cache }) => {
            const adr = hasAddress(address, cache)
            return adr ? true : false
        }
    },
    Mutation: {
        /**
         * Adds a new address to the cache if address does not exhists. Function checks if the address already exhists and returns it.
         * @param address: string, new address hash
         * @param name: string, new address name if any
         * @param cache: InMemoryCache, apollo cache object
         * @return - returns cachedAdrsType data type or null if !data.favAddresses
         */
        addFavAddress: (root, { address, name }, { cache }) => {
            const adr = hasAddress(address, cache)
            if (adr === null) {
                const newAdr: AddrType = {
                    __typename: TypeName.addr,
                    address: address,
                    name: name || ''
                }
                return changeFavAddressArray(Actions.add, cache, newAdr)
            }
            return adr
        }
    }
}

/*
  ===================================================================================
   Functions:
  ===================================================================================
*/

/**
 * Returns and Array of stored Address or null if !data.favAddresses
 * @param cache: InMemoryCache, apollo cache object
 * @return - returns cachedAdrsType data type or null if !data.favAddresses
 */
function getCachedAddrs(cache: InMemoryCache): cachedAdrsType | null {
    return cache.readQuery({ query: favAddressCache })
}

/**
 * Returns AddrType object with specified address hash  if it exhists in cache, otherwise null
 * @param address: string, address hash string to search for
 * @param cache: InMemoryCache, apollo cache object
 * @return - returns AddrType or  null if not found
 */
function hasAddress(address: string, cache: InMemoryCache): AddrType | null {
    const data = getCachedAddrs(cache)
    if (data && data.favAddresses && data.favAddresses.length > 0) {
        const items = data.favAddresses.filter(item => item.address.toLowerCase() === address.toLowerCase())
        return items.length > 0 ? items[0] : null
    }
    return null
}

/**
 * Function updates apollo cache, as we as,local storage in the application,
 * accordign to the specified action
 * @param address: string, address hash string to search for
 * @param cache: InMemoryCache, apollo cache object
 * @return - returns AddrType or  null if not found
 */

function changeFavAddressArray(action: Actions, cache: InMemoryCache, item: AddrType): AddrType {
    let storeAdrs = store.get(DataArray.addr) || []
    let data = getCachedAddrs(cache)

    if (data === null) {
        /* Update Store and Create new AddressArray */
        data = {
            favAddresses: action === Actions.delete ? [] : [item]
        }
        cache.writeData({
            data: data
        })
    }
    /* Add New Item*/
    if (action === Actions.add) {
        storeAdrs.push({ address: item.address, name: item.name })
        data.favAddresses.push(item)
    }

    /* Update Store and Apollo Cache */
    store.set(DataArray.addr, storeAdrs)
    cache.writeQuery({ query: favAddressCache, data })

    return item
}
