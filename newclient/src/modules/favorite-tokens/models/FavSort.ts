import { favTokenCache_favTokens as favTokenType } from '@app/apollo/favorite-tokens/apolloTypes/favTokenCache'
// import { EthValue } from '@app/core/models'

const KEY_ADDRESS = 'address'
const KEY_NAME = 'name'

// export interface FavoritesSort {
//     name?: string
//     address: string
//     balance?: number
//     balanceUSD?: number
// }

const FILTER_VALUES = ['address_high', 'address_low', 'name_high', 'name_low']
class FavSort {
    favorites!: favTokenType[]

    constructor(_favorites: favTokenType[]) {
        this.favorites = _favorites
    }
    // addFavoriteBalance(value: string, hash: string) {
    //     const favorite = this.favorites.find(addr => addr.address === hash)
    //     favorite ? (favorite.balance = parseFloat(new EthValue(value).toEthBN().toFixed())) : ''
    // }
    // addFavoriteBalanceUSD(value: string, hash: string) {
    //     const favorite = this.favorites.find(addr => addr.address === hash)
    //     favorite ? (favorite.balanceUSD = parseFloat(value)) : ''
    // }
    sortByDescend(data: favTokenType[], key: string) {
        if (data) {
            return data.sort((x, y) => (y[key] < x[key] ? -1 : y[key] > x[key] ? 1 : 0))
        }
        return []
    }
    sortByAscend(data: favTokenType[], key: string) {
        return this.sortByDescend(data, key).reverse()
    }
    sortFavorites(data: favTokenType[], sort: string) {
        if (sort === FILTER_VALUES[0] || sort === FILTER_VALUES[1]) {
            /* Sort By Address: */
            return sort.includes('high') ? this.sortByDescend(data, KEY_ADDRESS) : this.sortByAscend(data, KEY_ADDRESS)
        }
        /* Sort By Name: */
        return sort.includes('high') ? this.sortByDescend(data, KEY_NAME) : this.sortByAscend(data, KEY_NAME)
    }
}

export { FILTER_VALUES, FavSort }
