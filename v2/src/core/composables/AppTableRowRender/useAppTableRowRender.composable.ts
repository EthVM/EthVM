import { onMounted, onBeforeUnmount, nextTick, reactive } from 'vue'

export function useAppTableRowRender(totalItems: number) {
    interface RenderState {
        maxItems: number
        mountInterval: number | undefined
        isActive: boolean
        renderTable: boolean
    }
    /**
     * Tracks how table is being rendered.
     * @isActive  - defines whether or not interval is Running. Use this when returning computed list of rows.
     * @renderTable - defines when to render the actual table. Use this param with v-if on the actual table
     */
    const renderState = reactive<RenderState>({
        maxItems: 30,
        mountInterval: undefined,
        isActive: true,
        renderTable: false
    })

    /**
     * If table has more item then in maxItems:
     * - On the next tick starts interval to slowly increase number of rows to render
     * Sets interval to false, once interval completed or if total items <= maxItems
     */
    onMounted(() => {
        if (totalItems > renderState.maxItems) {
            nextTick(() => {
                renderState.mountInterval = window.setInterval(() => {
                    if (totalItems > renderState.maxItems) {
                        renderState.maxItems += 100
                    } else {
                        clearInterval(renderState.mountInterval)
                        renderState.isActive = false
                    }
                }, 100)
            })
        } else {
            renderState.isActive = false
        }
        renderState.renderTable = true
    })

    onBeforeUnmount(() => {
        clearInterval(renderState.mountInterval)
    })
    return { renderState }
}
