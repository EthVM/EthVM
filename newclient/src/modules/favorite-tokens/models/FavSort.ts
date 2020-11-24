// import { favTokenCache_favTokens as favTokenType } from '@app/apollo/favorite-tokens/apolloTypes/favTokenCache'
// import { EthValue } from '@app/core/models'

const KEY_VOLUME = 'volume'
const KEY_MARKET_CAP = 'market_cap'
const KEY_PRICE = 'address'
const KEY_NAME = 'name'

// export interface FavoritesSort {
//     name?: string
//     address: string
//     balance?: number
//     balanceUSD?: number
// }

const FILTER_VALUES = ['name_high', 'name_low', 'price_high', 'price_low', 'volume_high', 'volume_low', 'market_cap_high', 'market_cap_low']
class FavSort {
    favorites!: Array<{}>

    constructor(_favorites: Array<{}>) {
        this.favorites = _favorites
    }
    sortByDescend(data: Array<{}>, key: string) {
        if (data) {
            return data.sort((x, y) => (y[key] < x[key] ? -1 : y[key] > x[key] ? 1 : 0))
        }
        return []
    }
    sortByAscend(data: Array<{}>, key: string) {
        return this.sortByDescend(data, key).reverse()
    }
    sortFavorites(data: Array<{}>, sort: string) {
        if (sort === FILTER_VALUES[0] || sort === FILTER_VALUES[1]) {
            /* Sort By Price: */
            return sort.includes('high') ? this.sortByDescend(data, KEY_NAME) : this.sortByAscend(data, KEY_NAME)
        } else if (sort === FILTER_VALUES[2] || sort === FILTER_VALUES[3]) {
            /* Sort By Address: */
            return sort.includes('high') ? this.sortByDescend(data, KEY_PRICE) : this.sortByAscend(data, KEY_PRICE)
        } else if (sort === FILTER_VALUES[4] || sort === FILTER_VALUES[5]) {
            /* Sort By Volume: */
            return sort.includes('high') ? this.sortByDescend(data, KEY_VOLUME) : this.sortByAscend(data, KEY_VOLUME)
        } else if (sort === FILTER_VALUES[7] || sort === FILTER_VALUES[7]) {
            /* Sort By Volume: */
            return sort.includes('high') ? this.sortByDescend(data, KEY_MARKET_CAP) : this.sortByAscend(data, KEY_MARKET_CAP)
        }
        /* Sort By Symbol: */
        return sort.includes('high') ? this.sortByDescend(data, KEY_NAME) : this.sortByAscend(data, KEY_NAME)
    }
}

export { FILTER_VALUES, FavSort }
