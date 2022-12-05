import { useGetAddrRewardsBlockQuery, useGetAddrRewardsUncleQuery } from '@module/address/apollo/AddressRewards/rewards.generated'
import { computed } from 'vue'

export function useIsAddressMiner(addressHash: string) {
    const { result: addressRewardsBlockQueryResult, loading: loadingBlocks } = useGetAddrRewardsBlockQuery(() => ({
        hash: addressHash,
        _limit: 1
    }))

    const { result: addressRewardsUncleQueryResult, loading: loadingUncles } = useGetAddrRewardsUncleQuery(() => ({
        hash: addressHash,
        _limit: 1
    }))

    const isAddressMiner = computed<boolean>(() => {
        if (!loadingBlocks.value && !loadingUncles.value) {
            return (
                !!addressRewardsBlockQueryResult.value?.getBlockRewards?.transfers.length ||
                !!addressRewardsUncleQueryResult.value?.getUncleRewards?.transfers.length
            )
        }
        return false
    })

    return { isAddressMiner }
}
