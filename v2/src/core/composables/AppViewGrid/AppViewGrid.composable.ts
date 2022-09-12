import { computed } from 'vue'

import { useDisplay } from 'vuetify/lib/framework.mjs'

export function useAppViewGrid() {
    const { xs } = useDisplay()

    const columnPadding = computed<string>(() => {
        return xs.value ? 'pa-1' : 'pa-3'
    })
    const rowMargin = computed<string>(() => {
        return xs.value ? 'mx-n1' : 'mx-n3'
    })
    return { columnPadding, rowMargin }
}
