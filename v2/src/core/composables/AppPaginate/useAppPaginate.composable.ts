import { ITEMS_PER_PAGE } from '@core/constants'
import { computed, isRef, Ref, ref, watch } from 'vue'
import { useStore } from '@/store'
import { onBeforeRouteLeave } from 'vue-router'

export function useAppPaginate(dataToPaginate: Ref<Array<unknown>>, id?: Ref<string> | string) {
    const store = useStore()
    const pageNum = ref(1)

    const pageId = computed<string | undefined>(() => {
        return isRef(id) ? id.value : id
    })

    if (pageId.value) {
        if (!store.paginationStateMap.has(pageId.value)) {
            store.paginationStateMap.set(pageId.value, 1)
        }
        if (isRef(id)) {
            watch(id, (val: string) => {
                if (id && !store.paginationStateMap.has(val)) {
                    store.paginationStateMap.set(val, 1)
                }
            })
        }
    }

    const computedPageNum = computed<number>(() => {
        return pageId.value ? store.paginationStateMap.get(pageId.value) || 1 : pageNum.value
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
        if (pageId.value) {
            store.paginationStateMap.set(pageId.value, page)
        }
    }

    onBeforeRouteLeave(() => {
        if (pageId.value) {
            store.paginationStateMap.clear()
        }
    })

    return {
        numberOfPages,
        pageData,
        pageNum: computedPageNum,
        setPageNum
    }
}
