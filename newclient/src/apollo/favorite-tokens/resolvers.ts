import { InMemoryCache } from 'apollo-cache-inmemory'
import { favTokenCache } from './rootQuery.graphql'
import { TypeName, DataArray } from './models'
import store from 'store'
import { favTokenCache as cachedTokenType, favTokenCache_favTokens as TokenType } from './apolloTypes/favTokenCache'

enum Actions {
    add = 'addItem',
    delete = 'deleteItem'
}
export const resolvers = {
    Query: {
        /**
         * Checks whether or not an address is already in the favorite store, by address hash
         * @param address: string, new address hash
         * @param cache: InMemoryCache, apollo cache object
         * @return - returns cachedTokenType data type or null if !data.favTokens
         */
        checkToken: (root, { hash }, { cache }) => {
            return hasToken(hash, cache)
        }
    },
    Mutation: {
        /**
         * Adds a new address to the cache if address does not exhists. Checks if the address already exhists and returns it.
         * @param address: string, new address hash
         * @param name: string, new address name if any
         * @param cache: InMemoryCache, apollo cache object
         * @return - returns cachedTokenType data type or null if !data.favTokens
         */
        addFavToken: (root, { hash, symbol }, { cache }) => {
            const adr = hasToken(hash, cache)
            if (adr === null) {
                const newAdr: TokenType = {
                    __typename: TypeName.token,
                    address: hash,
                    symbol: symbol || ''
                }
                return changeFavToken(Actions.add, cache, newAdr)
            }
            return adr
        },
        /**
         * Deletes address from the cache if address exhists, otherwise returns null.
         * @param address: string, address hash
         * @param cache: InMemoryCache, apollo cache object
         * @return - returns cachedTokenType data type or null if address does not exhist
         */
        deleteFavToken: (root, { hash }, { cache }) => {
            const adr = hasToken(hash, cache)
            if (adr === null) {
                return null
            }
            return changeFavToken(Actions.delete, cache, adr)
        }
    }
}

/*
  ===================================================================================
   Functions:
  ===================================================================================
*/

/**
 * Returns and Array of stored Address or null if !data.favTokens
 * @param cache: InMemoryCache, apollo cache object
 * @return - returns cachedTokenType data type or null if !data.favTokens
 */
const getCacheToken = (cache: InMemoryCache): cachedTokenType | null => {
    return cache.readQuery({ query: favTokenCache })
}

/**
 * Returns TokenType object with specified address hash  if it exhists in cache, otherwise null
 * @param address: string, address hash string to search for
 * @param cache: InMemoryCache, apollo cache object
 * @return - returns TokenType or  null if not found
 */
const hasToken = (address: string, cache: InMemoryCache): TokenType | null => {
    const data = getCacheToken(cache)
    if (data && data.favTokens && data.favTokens.length > 0) {
        const items = data.favTokens.filter(item => item.address.toLowerCase() === address.toLowerCase())
        return items.length > 0 ? items[0] : null
    }
    return null
}

/**
 * Function updates apollo cache, as we as,local storage in the application,
 * according to the specified action: add, edit (name only), deletes - specifed item.
 * To edit an address name, use item param to specify new object name.
 * @param action: Actions; add, delete
 * @param cache: InMemoryCache, apollo cache object
 * @param item: TokenType;
 *    - add: will add new item to the cache
 *    - edit: will search for an object with item.address and edit the object with item.name
 *    - delete: will search for an object with item.address and delete this object
 * @return - returns TokenType - item
 */
const changeFavToken = (action: Actions, cache: InMemoryCache, item: TokenType): TokenType => {
    const storeAdrs = store.get(DataArray.token) || []
    let data = getCacheToken(cache)

    if (data === null) {
        /* Update Apollo Cache */
        data = {
            favTokens: []
        }
        cache.writeData({
            data: data
        })
    }
    /* Add New Item */
    if (action === Actions.add) {
        storeAdrs.push({ address: item.address, symbol: item.symbol })
        data.favTokens.push(item)
    }
    /* Delete an Item */
    if (action === Actions.delete) {
        const indexStore = data.favTokens.findIndex(i => i.address.toLowerCase() === item.address.toLowerCase())
        if (indexStore > -1) {
            storeAdrs.splice(indexStore, 1)
            data.favTokens.splice(indexStore, 1)
        }
    }

    /* Update Store and Apollo Cache */
    cache.writeQuery({ query: favTokenCache, data })
    store.set(DataArray.token, storeAdrs)
    return item
}
