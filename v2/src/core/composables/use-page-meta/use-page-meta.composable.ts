import { computed, Ref } from 'vue'
import { META } from '@/core/helper/tags'
import { useHead } from '@unhead/vue'
import { eth } from '@core/helper/eth'

export function usePageMeta(propVar: Ref<string> | null, tag: META) {
    const start = computed<string>(() => {
        return propVar ? propVar.value?.slice(0, 5) : ''
    })

    const end = computed<string>(() => {
        if (propVar) {
            const n = propVar.value?.length
            const sliceStart = n - 5 > 5 ? n - 5 : 5
            return propVar.value?.slice(sliceStart, n)
        }
        return ''
    })

    const metaTitle = computed<string>(() => {
        if (propVar) {
            const shortString = eth.isValidBlockNumber(propVar.value || '') ? propVar.value : `${start.value}...${end.value}`
            return tag.title.replace('***', shortString || '')
        }
        return tag.title
    })

    const metaDescription = computed<string>(() => {
        if (propVar) {
            return tag.description.replace('***', propVar.value || '')
        }
        return tag.description
    })

    useHead({
        title: () => metaTitle.value,
        meta: [
            { name: 'description', content: () => metaDescription.value },
            {
                property: 'og:title',
                content: () => metaTitle.value,
                vmid: 'og:title'
            },
            {
                property: 'og:description',
                content: () => metaDescription.value,
                vmid: 'og:description'
            },
            {
                property: 'twitter:title',
                content: () => metaTitle.value,
                vmid: 'twitter:title'
            },
            {
                property: 'twitter:description',
                content: () => metaDescription.value,
                vmid: 'twitter:description'
            }
        ]
    })

    return { metaTitle, metaDescription }
}
