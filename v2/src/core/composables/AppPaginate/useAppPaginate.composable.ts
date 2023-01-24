import { ITEMS_PER_PAGE } from '@core/constants'
import { computed, isRef, Ref, ref, watch } from 'vue'
import { useStore } from '@/store'
import { onBeforeRouteLeave } from 'vue-router'

export function useAppPaginate(dataToPaginate: Ref<Array<unknown>>, id?: Ref<string> | string) {
    const store = useStore()
    const pageNum = ref(1)

    const pageId = isRef(id) ? id.value : id
    if (pageId) {
        if (!store.paginationStateMap.has(pageId)) {
            store.paginationStateMap.set(pageId, 1)
        }
        if (isRef(id)) {
            watch(id, val => {
                if (id && !store.paginationStateMap.has(val)) {
                    store.paginationStateMap.set(val, 1)
                }
            })
        }
    }

    const computedPageNum = computed<number>(() => {
        const pageId = isRef(id) ? id.value : id
        return pageId ? store.paginationStateMap.get(pageId) || 1 : pageNum.value
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
        if (pageId) {
            store.paginationStateMap.set(pageId, page)
        }
    }

    onBeforeRouteLeave(() => {
        if (pageId) {
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
