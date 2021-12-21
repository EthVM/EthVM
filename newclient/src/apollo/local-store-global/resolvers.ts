import { InMemoryCache } from 'apollo-cache-inmemory'
import { getLocalAppStore } from './rootQuery.graphql'
import store from 'store'

export const resolvers = {
    Mutation: {
        /**
         * Adds a new address to the cache if address does not exhists. Checks if the address already exhists and returns it.
         * @param address: string, new address hash
         * @param name: string, new address name if any
         * @param cache: InMemoryCache, apollo cache object
         * @return - returns cachedAdrsType data type or null if !data.favAddresses
         */

        setConsentToTrack: (root, { consent }, { cache }) => {
            store.set('consentToTrack', consent)
            const data = getCachedLocalStore(cache)
            data.localAppStore.consentToTrack = consent
            cache.writeQuery({ query: getLocalAppStore, data })
        },
        setNotFirstTime: (root, { notFirstTimeVisit }, { cache }) => {
            store.set('notFirstTimeVisit', notFirstTimeVisit)
            const data = getCachedLocalStore(cache)
            data.localAppStore.notFirstTimeVisit = notFirstTimeVisit
            cache.writeQuery({ query: getLocalAppStore, data })
        },
        setDisplayedTrackingPopup: (root, { showed }, { cache }) => {
            store.set('displayedTrackingPopup', showed)
            const data = getCachedLocalStore(cache)
            data.localAppStore.displayedTrackingPopup = showed
            cache.writeQuery({ query: getLocalAppStore, data })
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
const getCachedLocalStore = (cache: InMemoryCache): any => {
    return cache.readQuery({ query: getLocalAppStore })
}
