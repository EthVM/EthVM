import { TokenOwnersFragment, useGetOwnersErc20TokensQuery } from '@module/address/apollo/AddressTokens/tokens.generated'
import { computed, Ref, ref, unref } from 'vue'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { TokenSort } from '@module/address/models/TokenSort'
import { formatUsdValue } from '@core/helper/number-format-helper'
import { eth } from '@/core/helper'
import BN from 'bignumber.js'
import { WatchQueryFetchPolicy } from '@apollo/client/core'

export function useAddressToken(addressHash: Ref<string> | string, policy: Ref<WatchQueryFetchPolicy> | WatchQueryFetchPolicy = 'cache-first') {
    const { getEthereumTokensMap, loading: loadingEthTokens } = useCoinData()
    const nextKey = ref<string | undefined | null>(undefined)
    const enableQuery = computed<boolean>(() => {
        return eth.isValidAddress(unref(addressHash))
    })

    const {
        result: erc20TokensResult,
        refetch: refetchTokens,
        onResult,
        fetchMore: fetchMoreTokens
    } = useGetOwnersErc20TokensQuery(
        () => ({
            hash: unref(addressHash).toLowerCase()
        }),
        () => ({
            fetchPolicy: unref(policy),
            enabled: enableQuery.value
        })
    )
    onResult(({ data }) => {
        if (data && data.getOwnersERC20Tokens) {
            nextKey.value = data.getOwnersERC20Tokens.nextKey
            if (nextKey.value && unref(policy) !== 'cache-only') {
                loadMoreTokens()
            }
        }
    })

    const initialLoad = computed<boolean>(() => {
        if (erc20TokensResult.value) {
            if (erc20TokensResult.value.getOwnersERC20Tokens.nextKey) {
                return !(erc20TokensResult.value.getOwnersERC20Tokens.nextKey === null || erc20TokensResult.value.getOwnersERC20Tokens.nextKey === undefined)
            }
            return false
        }
        return true
    })

    const loadMoreTokens = () => {
        fetchMoreTokens({
            variables: {
                hash: unref(addressHash).toLowerCase(),
                _nextKey: nextKey.value
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
                if (!fetchMoreResult) {
                    return previousResult
                }
                const newT = fetchMoreResult.getOwnersERC20Tokens.owners
                const prevT = previousResult.getOwnersERC20Tokens.owners
                return {
                    getOwnersERC20Tokens: {
                        __typename: previousResult.getOwnersERC20Tokens.__typename,
                        owners: [...prevT, ...newT],
                        nextKey: fetchMoreResult.getOwnersERC20Tokens.nextKey
                    }
                }
            }
        })
    }

    const loadingTokens = computed<boolean>(() => {
        return initialLoad.value || loadingEthTokens.value
    })
    const erc20Tokens = computed<Array<TokenOwnersFragment | null> | undefined>(() => {
        return erc20TokensResult.value?.getOwnersERC20Tokens.owners
    })

    const tokenCount = computed<number>(() => {
        return erc20Tokens.value?.length || 0
    })

    const tokenBalanceValue = computed<string>(() => {
        return tokenBalance.value || '0'
    })

    /**
     * Gets an object with all sorted arrays
     *
     * @returns false OR Map<string, TokenMarketData>  if values have been loaded
     * @returns  null  otherwise
     */
    const tokenPrices = computed<Map<string, TokenMarketData> | false | null>(() => {
        if (!initialLoad.value && erc20Tokens.value && !loadingEthTokens.value) {
            const contracts: string[] = []
            erc20Tokens.value.forEach(token => {
                if (token) {
                    contracts.push(token.tokenInfo.contract)
                }
            })
            if (contracts.length > 0) {
                return getEthereumTokensMap(contracts)
            }
        }
        return null
    })

    /**
     * Gets an object with all sorted arrays
     * @param {String} contract
     * @returns
     * - TokenSort if all has been loaded
     * - false if still loading
     */

    const tokenSort = computed<TokenSort | false>(() => {
        if (!initialLoad.value && erc20Tokens.value && tokenPrices.value !== null) {
            return new TokenSort(erc20Tokens.value, tokenPrices.value, true)
        }
        return false
    })

    /**
     * @returns {BN} - total token balance
     */
    const tokenTotalBalanceBN = computed<BN>(() => {
        if (!initialLoad.value && tokenSort.value) {
            const tokenAmounts = tokenSort.value.usdValue?.ascend.reduce((acc, el) => {
                return new BN(el.usdValue).plus(acc).toNumber()
            }, 0)
            if (tokenAmounts) {
                return new BN(tokenAmounts)
            }
        }
        return new BN(0)
    })

    /**
     * @returns {string} - total token balance in formatted string
     */
    const tokenBalance = computed<string>(() => {
        return formatUsdValue(tokenTotalBalanceBN.value).value
    })

    return {
        erc20Tokens,
        tokenPrices,
        loadingTokens,
        refetchTokens,
        tokenSort,
        tokenBalance,
        tokenTotalBalanceBN,
        initialLoad,
        tokenCount,
        tokenBalanceValue
    }
}
