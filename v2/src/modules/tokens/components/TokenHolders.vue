<template>
    <token-holders-table
        :holders="currentPageData"
        :loading="loading"
        :show-pagination="showPagination"
        :decimals="props.decimals"
        :max-items="queryLimit"
        :has-more="hasMore"
        :has-items="hasItems"
        :pages="numberOfPages"
        :current-page-num="pageNum"
        :has-error="state.hasError"
        :address="props.address"
        :token-data="tokenData"
        :holder-type="holderType"
        :initial-load="initialLoad"
        :nft-meta="nftMeta"
        :loading-meta="loadingMeta"
        @setPage="setPage"
    />
</template>

<script setup lang="ts">
import TokenHoldersTable from '@module/tokens/components/TokenDetailsHolder/TokenHolderTable.vue'
import { ErrorMessageToken } from '@module/tokens/models/ErrorMessagesForTokens'
import { excpInvariantViolation } from '@/apollo/errorExceptions'
import { reactive, computed, defineEmits, watch } from 'vue'
import {
    Erc20TokenOwnersFragment as Erc20TokenOwnersType,
    Erc721TokenOwnersFragment as Erc721TokenOwnersType,
    Erc1155TokenOwnersFragment as Erc1155TokenOwnersType,
    Erc721TokenOwnerDetailsFragment as Erc721Owner,
    Erc1155TokenOwnerDetailsFragment as Erc1155Owner,
    useGetErc20TokenOwnersQuery,
    useGetErc721TokenOwnersQuery,
    useGetErc1155TokenOwnersQuery
} from '@module/tokens/apollo/TokenDetailsHolder/tokenHolders.generated'
import { Erc20TokenOwnerDetailsFragment as Erc20Owner } from '@module/tokens/apollo/TokenDetails/tokenDetails.generated'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import { useGetNftsMeta } from '@core/composables/NftMeta/useGetNftsMeta.composable'
import { NftId, generateId } from '@/core/composables/NftMeta/helpers'
import { TransferType } from '@/apollo/types'
import { useAppPaginate } from '@core/composables/AppPaginate/useAppPaginate.composable'
import { ITEMS_PER_PAGE } from '@core/constants'
import { useDisplay } from 'vuetify'

interface PropType {
    address: string
    decimals?: number
}
const props = defineProps<PropType>()

const emit = defineEmits<{
    (e: 'errorDetails', value: boolean, message: string): void
    (e: 'setTokenType', value: string): void
}>()

interface ComponentState {
    page: number
    index: number
    isEnd: number
    hasError: boolean
}
const state: ComponentState = reactive({
    page: 0,
    index: 0,
    isEnd: 0,
    hasError: false
})

const { getEthereumTokenByContract, loading: loadingCoinData } = useCoinData()
const tokenData = computed<TokenMarketData | false>(() => {
    if (props.address) {
        try {
            emitErrorState(false)
            return getEthereumTokenByContract(props.address)
        } catch (error) {
            emitErrorState(true)
        }
    }
    return false
})
/**------------------------
 * ERC20 Holders
 -------------------------*/

const {
    result: erc20TokenHolderResult,
    loading: loadingErc20TokenHolder,
    fetchMore: fetchMoreErc20TokenHolder,
    refetch: refetchErc20TokenHolders,
    onError: onErc20TokenHoldersError,
    onResult: onErc20TokenHolderLoaded
} = useGetErc20TokenOwnersQuery(
    () => ({
        contract: props.address,
        _limit: ITEMS_PER_PAGE
    }),
    { notifyOnNetworkStatusChange: true }
)

const erc20TokenHolders = computed<Erc20TokenOwnersType | undefined>(() => {
    return erc20TokenHolderResult.value?.getERC20TokenOwners
})

onErc20TokenHoldersError(() => {
    emitErrorState(true)
})
const hasERC20Owners = computed<boolean>(() => {
    return !!erc20TokenHolders.value && erc20TokenHolders.value?.owners.length > 0
})

/**
 * Emit To Parent contract is ERC20
 */
if (erc20TokenHolderResult.value?.getERC20TokenOwners) {
    if (erc20TokenHolderResult.value.getERC20TokenOwners.owners.length > 0) {
        emit('setTokenType', TransferType.Erc20)
    }
} else {
    onErc20TokenHolderLoaded(({ data }) => {
        if (data?.getERC20TokenOwners) {
            if (data.getERC20TokenOwners.owners.length > 0) {
                emit('setTokenType', TransferType.Erc20)
            }
        }
    })
}

/**------------------------
 * ERC721 Holders
 -------------------------*/
const { sm } = useDisplay()
const {
    result: erc721TokenHoldersResult,
    loading: loadingErc721TokenHolders,
    fetchMore: fetchMoreErc721TokenHolder,
    refetch: refetchErc721TokenHolders,
    onError: onErc721TokenHolderError,
    onResult: onErc721TokenHolderLoaded
} = useGetErc721TokenOwnersQuery(
    () => ({
        contract: props.address,
        _limit: sm.value ? 24 : 48
    }),
    { notifyOnNetworkStatusChange: true }
)

const erc721TokenHolders = computed<Erc721TokenOwnersType | undefined>(() => {
    return erc721TokenHoldersResult.value?.getERC721TokenOwners
})

/**
 * Emit To Parent contract is ERC725
 */
if (erc721TokenHoldersResult.value?.getERC721TokenOwners) {
    if (erc721TokenHoldersResult.value.getERC721TokenOwners.owners.length > 0) {
        emit('setTokenType', TransferType.Erc721)
    }
} else {
    onErc721TokenHolderLoaded(({ data }) => {
        if (data?.getERC721TokenOwners) {
            if (data.getERC721TokenOwners.owners.length > 0) {
                emit('setTokenType', TransferType.Erc721)
            }
        }
    })
}

const hasERC721Owners = computed<boolean>(() => {
    return !!erc721TokenHolders.value && erc721TokenHolders.value?.owners.length > 0
})

onErc721TokenHolderError(() => {
    emitErrorState(true)
})

/**------------------------
 * ERC1155 Holders
 -------------------------*/

const {
    result: erc1155TokenHoldersResult,
    loading: loadingErc1155TokenHolders,
    fetchMore: fetchMoreErc1155TokenHolder,
    refetch: refetchErc1155TokenHolders,
    onError: onErc1155TokenHolderError,
    onResult: onErc1155TokenHolderLoaded
} = useGetErc1155TokenOwnersQuery(
    () => ({
        contract: props.address,
        _limit: ITEMS_PER_PAGE
    }),
    { notifyOnNetworkStatusChange: true }
)

const erc1155TokenHolders = computed<Erc1155TokenOwnersType | undefined>(() => {
    return erc1155TokenHoldersResult.value?.getERC1155TokensByContract
})

/**
 * Emit To Parent contract is ERC1155
 */
if (erc1155TokenHoldersResult.value?.getERC1155TokensByContract) {
    if (erc1155TokenHoldersResult.value.getERC1155TokensByContract.balances.length > 0) {
        emit('setTokenType', TransferType.Erc1155)
    }
} else {
    onErc1155TokenHolderLoaded(({ data }) => {
        if (data?.getERC1155TokensByContract) {
            if (data.getERC1155TokensByContract.balances.length > 0) {
                emit('setTokenType', TransferType.Erc1155)
            }
        }
    })
}

onErc1155TokenHolderError(() => {
    emitErrorState(true)
})

const hasERC1155Owners = computed<boolean>(() => {
    return !!erc1155TokenHolders.value && erc1155TokenHolders.value?.balances.length > 0
})

/**------------------------
 * Holder Type
 -------------------------*/
const loading = computed<boolean>(() => {
    return loadingErc20TokenHolder.value || loadingErc721TokenHolders.value || loadingCoinData.value || loadingErc1155TokenHolders.value
})

const hasNftOwners = computed<boolean>(() => {
    return hasERC1155Owners.value || hasERC721Owners.value
})

const holderType = computed<TransferType>(() => {
    return hasNftOwners.value ? (hasERC721Owners.value ? TransferType.Erc721 : TransferType.Erc1155) : TransferType.Erc20
})

/**------------------------
 * Holders
 -------------------------*/
const initialLoad = computed<boolean>(() => {
    return !erc721TokenHoldersResult.value || !erc20TokenHolderResult.value || !erc1155TokenHoldersResult.value
})

const holders = computed<Erc20Owner[] | Erc721Owner[] | Erc1155Owner[]>(() => {
    if (!initialLoad.value) {
        const data = hasERC20Owners.value
            ? erc20TokenHolders.value?.owners.filter((x): x is Erc20Owner => x !== null)
            : hasERC721Owners.value
            ? erc721TokenHolders.value?.owners.filter((x): x is Erc721Owner => x !== undefined)
            : erc1155TokenHolders.value?.balances.filter((x): x is Erc1155Owner => x !== undefined)

        if (data) {
            return data
        }
    }
    return []
})

const queryLimit = computed<number>(() => {
    if (holderType.value !== TransferType.Erc20) {
        return sm.value ? 24 : 48
    }
    return ITEMS_PER_PAGE
})

const { numberOfPages, pageData: currentPageData, setPageNum, pageNum } = useAppPaginate(holders, 'tokenHolders', queryLimit)

/**------------------------
 * NFT META
 -------------------------*/
/**
 * Computed Property of token ids to be fetch meta
 */
const tokenIDS = computed<NftId[]>(() => {
    const _ids: NftId[] = []
    if (holderType.value !== TransferType.Erc20 && hasNftOwners.value) {
        if (holderType.value === TransferType.Erc721) {
            currentPageData.value?.forEach(owner => {
                if (owner) {
                    const id = {
                        id: generateId(owner.tokenId),
                        contract: owner.tokenInfo.contract
                    }
                    _ids.push(id)
                }
            })
        } else if (holderType.value === TransferType.Erc1155) {
            currentPageData.value?.forEach(owner => {
                if (owner) {
                    const id = {
                        id: generateId(owner.tokenInfo.tokenId),
                        contract: owner.tokenInfo.contract
                    }
                    _ids.push(id)
                }
            })
        }
    }
    return _ids
})
const { nftMeta, loadingMeta } = useGetNftsMeta(tokenIDS, loading)

const hasItems = computed<boolean>(() => {
    return !!(holders.value && holders.value.length)
})

const nextKey = computed<string | null | undefined>(() => {
    if (holderType.value === TransferType.Erc20) {
        return erc20TokenHolders.value?.nextKey
    }
    if (holderType.value === TransferType.Erc721) {
        return erc721TokenHolders.value?.nextKey
    }
    if (holderType.value === TransferType.Erc1155) {
        return erc1155TokenHolders.value?.nextKey
    }
    return undefined
})

const showPagination = computed<boolean>(() => {
    return !initialLoad.value && !!holders.value && (holders.value.length > queryLimit.value || !!nextKey.value)
})

const hasMore = computed<boolean>(() => {
    return hasItems.value && !!nextKey.value
})

/**
 * @param val {Boolean}
 * @param isErc20 {Boolean}
 */
const emitErrorState = (val: boolean): void => {
    state.hasError = val
    emit('errorDetails', val, ErrorMessageToken.tokenOwner)
}

/**
 * Sets page number and reset value and emit
 * @param page {Number}
 * @param reset {Boolean}
 */
const setPage = (page: number, reset = false): void => {
    if (reset) {
        state.isEnd = 0
        refetchErc20TokenHolders()
        refetchErc721TokenHolders()
        refetchErc1155TokenHolders()
    } else {
        if (page > state.isEnd && hasMore.value) {
            fetchMoreHolders(page)
        }
    }
    setPageNum(page)
}

/**
 * Helper Functions to parse results from the fetch more queries
 * @param prev - previous transfers results in the query
 * @param more - more transfers results in the query
 * @returns {T} - parsed T results
 */
const updateQueryParse = <T extends Erc20TokenOwnersType | Erc721TokenOwnersType>(prev: T, more: T | undefined) => {
    const prevHolders = prev.owners
    const moreHolders = more ? more.owners : []
    return {
        nextKey: more?.nextKey,
        owners: [...prevHolders, ...moreHolders],
        __typename: prev.__typename
    }
}
/**
 * Fetched More Holders based on the curent contract type. Sets index to the last page
 * @param page - page number that is being fetched
 */
const fetchMoreHolders = async (page: number): Promise<boolean> => {
    try {
        const _params = {
            _contract: props.address,
            _limit: queryLimit.value,
            _nextKey: nextKey.value
        }
        switch (holderType.value) {
            case TransferType.Erc20:
                await fetchMoreErc20TokenHolder({
                    variables: _params,
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        return {
                            __typename: 'Query',
                            getERC20TokenOwners: updateQueryParse(
                                previousResult.getERC20TokenOwners,
                                fetchMoreResult?.getERC20TokenOwners
                            ) as Erc20TokenOwnersType
                        }
                    }
                })
                break
            case TransferType.Erc721:
                await fetchMoreErc721TokenHolder({
                    variables: _params,
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        return {
                            __typename: 'Query',
                            getERC721TokenOwners: updateQueryParse(
                                previousResult.getERC721TokenOwners,
                                fetchMoreResult?.getERC721TokenOwners
                            ) as Erc721TokenOwnersType
                        }
                    }
                })
                break
            default:
                await fetchMoreErc1155TokenHolder({
                    variables: _params,
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        const prev = previousResult.getERC1155TokensByContract.balances
                        const more = fetchMoreResult ? fetchMoreResult.getERC1155TokensByContract.balances : []
                        return {
                            __typename: 'Query',
                            getERC1155TokensByContract: {
                                nextKey: fetchMoreResult?.getERC1155TokensByContract.nextKey,
                                balances: [...prev, ...more],
                                __typename: previousResult.getERC1155TokensByContract.__typename
                            }
                        }
                    }
                })
                break
        }
        state.isEnd = page
        return true
    } catch (e) {
        const newE = JSON.stringify(e)
        if (!newE.toLowerCase().includes(excpInvariantViolation)) {
            throw new Error(newE)
        }
        return false
    }
}
watch(
    () => props.address,
    (newAdr, oldAdr) => {
        if (newAdr.toLowerCase() !== oldAdr.toLowerCase()) {
            state.isEnd = 0
            state.page = 0
            state.index = 0
            state.hasError = false
        }
    }
)
</script>
