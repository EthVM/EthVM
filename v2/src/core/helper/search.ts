import * as Sentry from '@sentry/vue'

// eslint-disable-next-line
const _getItemToSearch = (obj: any, key: string): string | undefined => {
    const searchKeyArr = key.split('.')
    // This would be for nested strings like tokenInfo.name
    if (searchKeyArr.length > 1) {
        return _getItemToSearch(obj[searchKeyArr[0]], searchKeyArr[1])
    }
    return obj[key]
}

export const searchHelper = <T>(items: T[], keysToSearch: string[], searchParams: string) => {
    try {
        const startsWith: T[] = []
        const notStartsWith: T[] = []
        const includes = items.filter(item => {
            return keysToSearch.some(el => {
                const searchValue = _getItemToSearch(item, el)
                return searchValue ? searchValue.toLowerCase().includes(searchParams.toLowerCase()) : false
            })
        })

        includes.forEach(item => {
            const itemStartsWith = keysToSearch.some(el => {
                const searchValue = _getItemToSearch(item, el)
                return searchValue ? searchValue.toLowerCase().startsWith(searchParams.toLowerCase()) : false
            })
            if (itemStartsWith) {
                startsWith.push(item)
            } else {
                notStartsWith.push(item)
            }
        })

        return [...startsWith, ...notStartsWith]
    } catch (error) {
        Sentry.captureException(`ERROR in searchHelper: ${error}. ITEMS:  ${items}, KEYS: ${keysToSearch}, PARAMS ${searchParams}`)
    }
}
