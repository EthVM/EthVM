import { ITEMS_PER_PAGE } from '@core/constants'

export function useAppPaginate(pageNum: number) {
    const numberOfPages = (data: Array<unknown>) => {
        return Math.ceil(data.length / ITEMS_PER_PAGE)
    }

    const start = (pageNum - 1) * ITEMS_PER_PAGE
    const end = pageNum * ITEMS_PER_PAGE

    return {
        numberOfPages,
        end,
        start
    }
}
