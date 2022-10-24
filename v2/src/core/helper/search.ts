const _getItemToSearch = (obj: any, key: string): string => {
    const searchKeyArr = key.split('.')
    // This would be for nested strings like tokenInfo.name
    if (searchKeyArr.length > 1) {
        return _getItemToSearch(obj[searchKeyArr[0]], searchKeyArr[1])
    }
    return obj[key]
}

export const searchHelper = (items: any[], keysToSearch: string[], searchParams: string) => {
    const startsWith: unknown[] = []
    const notStartsWith: unknown[] = []
    const includes = items.filter(item => {
        return keysToSearch.some(el => {
            const searchValue = _getItemToSearch(item, el)
            return searchValue.toLowerCase().includes(searchParams.toLowerCase())
        })
    })

    includes.forEach(item => {
        const itemStartsWith = keysToSearch.some(el => {
            const searchValue = _getItemToSearch(item, el)
            return searchValue.toLowerCase().startsWith(searchParams.toLowerCase())
        })

        if (itemStartsWith) {
            startsWith.push(item)
        } else {
            notStartsWith.push(item)
        }
    })

    return [startsWith, notStartsWith]
}
