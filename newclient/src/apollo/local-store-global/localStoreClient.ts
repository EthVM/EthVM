import { LocalStore, Query, Mutation } from './schema.graphql'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { resolvers } from './resolvers'
import store from 'store'

const LocalStorageTypeDef = `${LocalStore} ${Query} ${Mutation}`
const localStorageCache = new InMemoryCache()

const getLocalStorageCache = (_cache: InMemoryCache): void => {
    const _consentToTrack = store.get('consentToTrack') === true
    const _notFirstTimeVisit = store.get('notFirstTimeVisit') === true
    const _displayedTrackingPopup = store.get('displayedTrackingPopup') === true
    _cache.writeData({
        data: {
            localAppStore: {
                __typename: 'LocalStore',
                consentToTrack: _consentToTrack,
                notFirstTimeVisit: _notFirstTimeVisit,
                displayedTrackingPopup: _displayedTrackingPopup
            }
        }
    })
}
getLocalStorageCache(localStorageCache)

/* Listen to updates on different browser Tabs */
window.addEventListener('storage', event => {
    console.log(event.key)
    // if (event.key === DataArray.addr) {
    //     getLocalStorageCache(localStorageCache)
    // }
})

export const LocalStoreClient = new ApolloClient({
    cache: localStorageCache,
    typeDefs: LocalStorageTypeDef,
    resolvers: resolvers
})
