import { ITEMS_PER_PAGE } from '@core/constants'
import { computed, Ref, ref, toRefs, unref, watch } from 'vue'
import { useStore } from '@/store'

export function useAppPaginate(dataToPaginate: Ref<Array<unknown>>, id?: Ref<string>) {
    const store = useStore()
    const pageNum = ref(1)

    if (id) {
        if (!store.paginationStateMap.has(id.value)) {
            store.paginationStateMap.set(id.value, 1)
        }
        watch(id, () => {
            if (id && !store.paginationStateMap.has(id.value)) {
                store.paginationStateMap.set(id.value, 1)
            }
        })
    }

    const computedPageNum = computed<number>(() => {
        return id ? store.paginationStateMap.get(id.value) || 1 : pageNum.value
    })

    const pageData = computed(() => {
        const start = (computedPageNum.value - 1) * ITEMS_PER_PAGE
        const end = computedPageNum.value * ITEMS_PER_PAGE
        return dataToPaginate.value.slice(start, end)
    })

    const numberOfPages = computed<number>(() => {
        return Math.ceil(dataToPaginate.value.length / ITEMS_PER_PAGE)
    })

    const setPageNum = (page: number) => {
        pageNum.value = page
        if (id) {
            store.paginationStateMap.set(id.value, page)
        }
    }

    return {
        numberOfPages,
        pageData,
        pageNum: computedPageNum,
        setPageNum
    }
}
