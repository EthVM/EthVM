const KEY_VOLUME = 'total_volume'
const KEY_MARKET_CAP = 'market_cap'
const KEY_PRICE = 'current_price'
const KEY_NAME = 'name'
const KNOWN_NUM = ['total_volume', 'market_cap', 'current_price']

const FILTER_VALUES = ['name_high', 'name_low', 'price_high', 'price_low', 'volume_high', 'volume_low', 'market_cap_high', 'market_cap_low']
class FavSort {
    favorites!: Array<{}>

    constructor(_favorites: Array<{}>) {
        this.favorites = _favorites
    }
    sortByDescend(data: Array<{}>, key: string) {
        if (data) {
            if (KNOWN_NUM.includes(key)) {
                return data.sort((x, y) => (y[key] < x[key] ? -1 : y[key] > x[key] ? 1 : 0))
            }

            return data.sort((x, y) => (y[key].toLowerCase() < x[key].toLowerCase() ? -1 : y[key].toLowerCase() > x[key].toLowerCase() ? 1 : 0))
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
            /* Sort By Price: */
            return sort.includes('high') ? this.sortByDescend(data, KEY_PRICE) : this.sortByAscend(data, KEY_PRICE)
        } else if (sort === FILTER_VALUES[4] || sort === FILTER_VALUES[5]) {
            /* Sort By Volume: */
            return sort.includes('high') ? this.sortByDescend(data, KEY_VOLUME) : this.sortByAscend(data, KEY_VOLUME)
        } else if (sort === FILTER_VALUES[6] || sort === FILTER_VALUES[7]) {
            /* Sort By Market Cap: */
            return sort.includes('high') ? this.sortByDescend(data, KEY_MARKET_CAP) : this.sortByAscend(data, KEY_MARKET_CAP)
        }
        /* Sort By Name: */
        return sort.includes('high') ? this.sortByDescend(data, KEY_NAME) : this.sortByAscend(data, KEY_NAME)
    }
}

export { FILTER_VALUES, FavSort }
