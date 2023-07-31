import { computed, Ref } from 'vue'
import { META } from '@/core/helper/tags'
import { useHead } from '@unhead/vue'
import { eth } from '@core/helper/eth'

export function usePageMeta(propVar: Ref<string>, tag: META) {
    const start = computed<string>(() => {
        return propVar.value?.slice(0, 5)
    })

    const end = computed<string>(() => {
        const n = propVar.value?.length
        const sliceStart = n - 5 > 5 ? n - 5 : 5
        return propVar.value?.slice(sliceStart, n)
    })

    const metaTitle = computed<string>(() => {
        const shortString = eth.isValidBlockNumber(propVar.value || '') ? propVar.value : `${start.value}...${end.value}`
        return tag.title.replace('***', shortString || '')
    })

    const metaDescription = computed<string>(() => {
        return tag.description.replace('***', propVar.value || '')
    })

    useHead({
        title: () => metaTitle.value,
        meta: [{ name: 'description', content: () => metaDescription.value }]
    })

    return { metaTitle, metaDescription }
}
