import { ITEMS_PER_PAGE } from '@core/constants'
import { computed, isRef, Ref, ref, watch } from 'vue'
import { useStore } from '@/store'
import { onBeforeRouteLeave } from 'vue-router'

export function useAppPaginate<T>(dataToPaginate: Ref<Array<T>>, id?: Ref<string> | string, itemsPerPage?: number | Ref<number>) {
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
    const dataLenth = computed(() => {
        return dataToPaginate.value.length
    })

    watch(dataLenth, (newVal, oldVal) => {
        if (newVal < oldVal) {
            setPageNum(1)
        }
    })

    const computedPageNum = computed<number>(() => {
        return pageId.value ? store.paginationStateMap.get(pageId.value) || 1 : pageNum.value
    })

    const numberOfItemsPerPage = computed<number>(() => {
        if (!itemsPerPage) {
            return ITEMS_PER_PAGE
        }
        return isRef(itemsPerPage) ? itemsPerPage.value : itemsPerPage
    })

    const pageData = computed(() => {
        const start = (computedPageNum.value - 1) * numberOfItemsPerPage.value
        const end = computedPageNum.value * numberOfItemsPerPage.value
        return dataToPaginate.value.slice(start, end)
    })

    const numberOfPages = computed<number>(() => {
        return Math.ceil(dataToPaginate.value.length / numberOfItemsPerPage.value)
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
