import { favAddressCache_favAddresses as favAddressesType } from '@app/apollo/favorites/apolloTypes/favAddressCache'
import { EthValue } from '@app/core/models'

const FILTER_VALUES = ['address_high', 'address_low', 'name_high', 'name_low', 'balance_high', 'balance_low', 'value_high', 'value_low']
const MAX_ITEMS = 10
const KEY_ADDRESS = 'address'
const KEY_NAME = 'name'
const KEY_BALANCE = 'balance'
const KEY_BALANCE_USD = 'balanceUSD'

interface FavoritesSort {
    name?: string
    address: string
    balance?: number
    balanceUSD?: number
}

export class FavSort {
    favorites!: FavoritesSort[]

    constructor(_favorites: FavoritesSort[]) {
        this.favorites = _favorites
    }
    addFavoriteBalance(value: string, hash: string) {
        const favorite = this.favorites.find(addr => addr.address === hash)
        favorite ? (favorite.balance = parseInt(new EthValue(value).toEthBN().toFixed())) : ''
    }
    addFavoriteBalanceUSD(value: string, hash: string) {
        const favorite = this.favorites.find(addr => addr.address === hash)
        favorite ? (favorite.balanceUSD = parseInt(value)) : ''
    }
    sortByDescend(key: string) {
        if (this.favorites) {
            return this.favorites.sort((x, y) => (y[key] < x[key] ? -1 : y[key] > x[key] ? 1 : 0))
        }
        return []
    }
    sortByAscend(key: string) {
        return this.sortByDescend(key).reverse()
    }
    sortFavorites(sort: string) {
        if (sort === FILTER_VALUES[0] || sort === FILTER_VALUES[1]) {
            /* Sort By Address: */
            this.favorites = sort.includes('high') ? this.sortByDescend(KEY_ADDRESS) : this.sortByAscend(KEY_ADDRESS)
        } else if (sort === FILTER_VALUES[2] || sort === FILTER_VALUES[3]) {
            /* Sort By Name: */
            this.favorites = sort.includes('high') ? this.sortByDescend(KEY_NAME) : this.sortByAscend(KEY_NAME)
        } else if (sort === FILTER_VALUES[4] || sort === FILTER_VALUES[5]) {
            /* Sort By Balance: */
            this.favorites = sort.includes('high') ? this.sortByDescend(KEY_BALANCE) : this.sortByAscend(KEY_BALANCE)
        } else {
            /* Sort By Balance USD: */
            this.favorites = sort.includes('high') ? this.sortByDescend(KEY_BALANCE_USD) : this.sortByAscend(KEY_BALANCE_USD)
        }
    }
}
