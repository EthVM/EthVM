import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { eth } from '@/core/helper'

import { useGetEthBalanceQuery } from './addressBalance.generated'
import { computed, ref } from 'vue'

import { formatUsdValue, formatVariableUnitEthValue } from '@core/helper/number-format-helper'
import BN from 'bignumber.js'

export function useAddressEthBalance(addressHash: string) {
    const { loading: loadingMarketInfo, ethMarketInfo } = useCoinData()

    const initialLoad = ref(true)

    const {
        result: balanceData,
        // onError,
        refetch: refetchBalance,
        onResult
    } = useGetEthBalanceQuery(
        () => ({
            hash: addressHash
        }),
        () => ({
            fetchPolicy: 'cache-and-network'
        })
    )

    /**
     * Once data is recieved sets loading to false
     */
    onResult(({ data }) => {
        if (data && data.getEthBalance) {
            initialLoad.value = false
            // emitErrorState(false)
        }
    })
    /**
     * ETH balance in WEI
     */
    const balanceWei = computed<string>(() => {
        const balance = balanceData.value?.getEthBalance.balance
        return balance ? balance : '0'
    })
    /**
     * Returns formatted balance in ETH
     */
    const balanceFormatted = computed<string>(() => {
        return formatVariableUnitEthValue(new BN(balanceWei.value)).value
    })
    /**
     * Returns FIAT balance in BN
     */
    const balanceFiatBN = computed<BN>(() => {
        if (!loadingMarketInfo.value && !initialLoad.value) {
            const ethPrice = ethMarketInfo?.value?.current_price || 0
            const balanceInEth = eth.toEthFromWei(balanceWei.value)
            return new BN(balanceInEth).multipliedBy(new BN(ethPrice))
        }
        return new BN(0)
    })
    /**
     * Returns formatted ETH balance in FIAT
     */
    const balanceFiatFormatted = computed<string>(() => {
        if (!loadingMarketInfo.value && !initialLoad.value) {
            return formatUsdValue(balanceFiatBN.value).value
        }
        return '$0.00'
    })

    return { balanceData, initialLoad, refetchBalance, balanceFiatFormatted, balanceWei, balanceFormatted, balanceFiatBN }
}
