import { useNewBlockFeedSubscription } from './newBlockFeed.generated'
import { computed } from 'vue'

export function useBlockSubscription() {
    const { onResult, result } = useNewBlockFeedSubscription()

    const newBlockNumber = computed<number | undefined>(() => {
        return result ? result.value?.newBlockFeed.number : undefined
    })

    const newTxs = computed<number | undefined>(() => {
        return result ? result.value?.newBlockFeed.txCount : undefined
    })
    return {
        onNewBlockLoaded: onResult,
        newBlockNumber,
        newTxs
    }
}
