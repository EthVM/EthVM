import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { eth } from '@/core/helper'
import { useGetEthBalanceQuery } from './addressBalance.generated'
import { computed, ref, Ref, watch, unref, isRef } from 'vue'
import { formatUsdValue, formatVariableUnitEthValue } from '@core/helper/number-format-helper'
import BN from 'bignumber.js'

export function useAddressEthBalance(addressHash: Ref<string> | string) {
    const { loading: loadingMarketInfo, ethMarketInfo } = useCoinData()

    const initialLoad = ref(true)

    const enableQuery = computed<boolean>(() => {
        return eth.isValidAddress(unref(addressHash))
    })

    /**
     * If passed prefetch is defined --> skips query execution.
     * Otherwhise, asigns passed query results
     */

    const {
        result: balanceData,
        // onError,
        refetch: refetchBalance,
        onResult
    } = useGetEthBalanceQuery(
        () => ({
            hash: unref(addressHash).toLowerCase()
        }),
        () => ({
            fetchPolicy: 'cache-and-network',
            enabled: enableQuery.value
        })
    )
    if (balanceData.value) {
        initialLoad.value = false
    }

    /**
     * Once data is recieved sets loading to false
     */
    onResult(({ data }) => {
        if (data && data.getEthBalance) {
            initialLoad.value = false
            balanceData.value = data
        }
    })

    /**
     * loadingBalance
     */
    const loadingBalance = computed<boolean>(() => {
        return initialLoad.value || loadingMarketInfo.value
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

    /**
     * If passed param is Ref -->
     * Watches for changes in the addressHash string
     * Resets initial load to true on new hash
     */
    if (isRef(addressHash)) {
        watch(addressHash, (newHash, oldHash) => {
            if (newHash !== oldHash) {
                initialLoad.value = true
            }
        })
    }

    return { balanceData, initialLoad, loadingBalance, refetchBalance, balanceFiatFormatted, balanceWei, balanceFormatted, balanceFiatBN }
}
