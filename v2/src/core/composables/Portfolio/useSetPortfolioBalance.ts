import { useCoinData } from '../CoinData/coinData.composable'
import { computed, Ref, unref } from 'vue'
import { useStore } from '@/store'
import { useGetEthBalanceQuery } from '../AddressEthBalance/addressBalance.generated'
import { useAddressEthBalance } from '../AddressEthBalance/addressEthBalance.composable'

export function useSetPortfolio(addressHash: Ref<string> | string) {
    const store = useStore()
    const { loading: loadingMarketInfo } = useCoinData()

    /**
     * Enables query after market data was loaded and when addressHash is valid
     */
    const enableQ = computed<boolean>(() => {
        return loadingMarketInfo.value === false && unref(addressHash) !== ''
    })

    const { onResult: onEthBalanceResult, refetch: refetchEthBalance } = useGetEthBalanceQuery(
        () => ({
            hash: unref(addressHash)
        }),
        () => ({
            fetchPolicy: 'network-only',
            enabled: enableQ.value
        })
    )
    onEthBalanceResult(({ data }) => {
        if (data && data.getEthBalance) {
            const owner = data.getEthBalance.owner
            const { balanceWei, balanceFormatted, balanceFiatBN, balanceFiatFormatted } = useAddressEthBalance(owner, data)
            store.addEthBalance(owner, unref(balanceWei), unref(balanceFormatted), unref(balanceFiatBN), unref(balanceFiatFormatted))
        }
    })

    return { refetchEthBalance }
}
