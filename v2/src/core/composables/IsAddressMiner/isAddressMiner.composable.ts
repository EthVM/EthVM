import { useGetAddrRewardsBlockQuery, useGetAddrRewardsUncleQuery } from '@module/address/apollo/AddressRewards/rewards.generated'
import { computed, Ref } from 'vue'
import { eth } from '@/core/helper'

export function useIsAddressMiner(addressHash: Ref<string | undefined>) {
    const isValidAddress = computed<boolean>(() => {
        return eth.isValidAddress(addressHash.value || '')
    })

    const { result: addressRewardsBlockQueryResult, loading: loadingBlocks } = useGetAddrRewardsBlockQuery(
        () => ({
            hash: addressHash.value || '',
            _limit: 1
        }),
        () => ({
            enabled: isValidAddress.value
        })
    )

    const { result: addressRewardsUncleQueryResult, loading: loadingUncles } = useGetAddrRewardsUncleQuery(
        () => ({
            hash: addressHash.value || '',
            _limit: 1
        }),
        () => ({
            enabled: isValidAddress.value
        })
    )

    const isAddressMiner = computed<boolean>(() => {
        if (isValidAddress.value && !loadingBlocks.value && !loadingUncles.value) {
            return (
                !!addressRewardsBlockQueryResult.value?.getBlockRewards?.transfers.length ||
                !!addressRewardsUncleQueryResult.value?.getUncleRewards?.transfers.length
            )
        }
        return false
    })

    return { isAddressMiner }
}
