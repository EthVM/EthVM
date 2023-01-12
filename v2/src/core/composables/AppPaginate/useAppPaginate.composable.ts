import { ITEMS_PER_PAGE } from '@core/constants'
import { computed, Ref, ref } from 'vue'

export function useAppPaginate(dataToPaginate: Ref<Array<unknown>>) {
    const pageNum = ref(1)

    const pageData = computed(() => {
        console.log(dataToPaginate.value)
        const start = (pageNum.value - 1) * ITEMS_PER_PAGE
        const end = pageNum.value * ITEMS_PER_PAGE
        console.log(start, end)
        console.log('sliced', dataToPaginate.value.slice(start, end))
        return dataToPaginate.value.slice(start, end)
    })

    const numberOfPages = computed<number>(() => {
        return Math.ceil(dataToPaginate.value.length / ITEMS_PER_PAGE)
    })

    const setPageNum = (page: number) => {
        pageNum.value = page
    }

    return {
        numberOfPages,
        pageData,
        pageNum,
        setPageNum
    }
}
