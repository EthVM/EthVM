<template>
    <token-transfers-table
        :transfers="currentPageData"
        :loading="loading"
        :initial-load="initialLoad"
        :show-pagination="showPagination"
        :decimals="props.decimals"
        :symbol="props.symbol"
        :max-items="ITEMS_PER_PAGE"
        :has-more="hasMore"
        :has-items="hasItems"
        :pages="numberOfPages"
        :current-page-num="pageNum"
        :has-error="state.hasError"
        :transfer-type="transferType"
        :nft-meta="nftMeta"
        :loading-meta="loadingMeta"
        @setPage="setPage"
    />
</template>

<script setup lang="ts">
import TokenTransfersTable from '@module/tokens/components/TokenDetailsTransfer/TokenTransferTable.vue'
import { ErrorMessageToken } from '@module/tokens/models/ErrorMessagesForTokens'
import { excpInvariantViolation } from '@/apollo/errorExceptions'
import { reactive, computed, defineEmits } from 'vue'
import {
    useGetErc20TokenTransfersQuery,
    useGetErc721TokenTransfersQuery,
    useGetErc1155TokenTransfersQuery,
    Erc20TokenTransfersFragment,
    Erc721TokenTransfersFragment,
    Erc1155TokenTransfersFragment,
    TokenTransferFragment,
    Erc721TransferFragment,
    Erc1155TokenTransferFragment
} from '@module/tokens/apollo/TokenDetailsTransfer/tokenTransfers.generated'
import { useGetNftsMeta } from '@core/composables/NftMeta/useGetNftsMeta.composable'
import { NftId, generateId } from '@/core/composables/NftMeta/helpers'
import { TransferType } from '@/apollo/types'
import { useAppPaginate } from '@core/composables/AppPaginate/useAppPaginate.composable'
import { ITEMS_PER_PAGE } from '@core/constants'

interface PropType {
    address: string
    pageType: string
    decimals?: number
    symbol?: string
}
const props = defineProps<PropType>()

const emit = defineEmits<{
    (e: 'errorDetails', value: boolean, message: string): void
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

/**------------------------
 * ERC20 TRANSFERS
 -------------------------*/
const {
    result: erc20TokenTransferResult,
    loading: loadingErc20TokenTransfer,
    fetchMore: fetchMoreErc20TokenTransfer,
    refetch: refetchErc20TokenTransfer,
    onError: onErc20TokenTransferError
} = useGetErc20TokenTransfersQuery(
    () => ({
        _contract: props.address,
        _limit: ITEMS_PER_PAGE
    }),
    { notifyOnNetworkStatusChange: true }
)

const erc20TokenTransfer = computed<Erc20TokenTransfersFragment | undefined>(() => {
    return erc20TokenTransferResult.value?.getERC20TokenTransfers
})

onErc20TokenTransferError(() => {
    emitErrorState(true, true)
})

const hasMoreERC20Transfers = computed<boolean>(() => {
    return erc20TokenTransfer.value ? erc20TokenTransfer.value.nextKey !== null : false
})

/**------------------------
 * ERC721 TRANSFERS
 -------------------------*/
const {
    result: erc721TokenTransferResult,
    loading: loadingErc721TokenTransfer,
    fetchMore: fetchMoreErc721TokenTransfer,
    refetch: refetchErc721TokenTransfer,
    onError: onErc721TokenTransferError
} = useGetErc721TokenTransfersQuery(
    () => ({
        _contract: props.address,
        _limit: ITEMS_PER_PAGE
    }),
    { notifyOnNetworkStatusChange: true }
)

const erc721TokenTransfer = computed<Erc721TokenTransfersFragment | undefined>(() => {
    return erc721TokenTransferResult.value?.getERC721TokenTransfers
})

onErc721TokenTransferError(() => {
    emitErrorState(true, true)
})

const hasERC721Transfers = computed<boolean>(() => {
    return !!erc721TokenTransfer.value && erc721TokenTransfer.value.transfers.length > 0
})

const hasMoreERC721Transfers = computed<boolean>(() => {
    return erc721TokenTransfer.value ? erc721TokenTransfer.value.nextKey !== null : false
})

/**------------------------
 * ERC1155 TRANSFERS
 -------------------------*/

const {
    result: erc1155TokenTransferResult,
    loading: loadingErc1155TokenTransfer,
    fetchMore: fetchMoreErc1155TokenTransfer,
    refetch: refetchErc1155TokenTransfer,
    onError: onErc1155TokenTransferError
} = useGetErc1155TokenTransfersQuery(
    () => ({
        _contract: props.address,
        _limit: ITEMS_PER_PAGE
    }),
    { notifyOnNetworkStatusChange: true }
)

const erc1155TokenTransfers = computed<Erc1155TokenTransfersFragment | undefined>(() => {
    return erc1155TokenTransferResult.value?.getERC1155TokenTransfers
})

onErc1155TokenTransferError(() => {
    emitErrorState(true, true)
})

const hasERC1155Transfers = computed<boolean>(() => {
    return !!erc1155TokenTransfers.value && erc1155TokenTransfers.value.transfers.length > 0
})

const hasMoreERC1155Transfers = computed<boolean>(() => {
    return erc1155TokenTransfers.value ? erc1155TokenTransfers.value.nextKey !== null : false
})

const transferType = computed<TransferType>(() => {
    return hasNftTransfers.value ? (hasERC721Transfers.value ? TransferType.Erc721 : TransferType.Erc1155) : TransferType.Erc20
})

/**------------------------
 * NFT META
 -------------------------*/

const loadingTransfers = computed<boolean>(() => {
    return loadingErc20TokenTransfer.value || loadingErc721TokenTransfer.value || loadingErc1155TokenTransfer.value
})

const hasNftTransfers = computed<boolean>(() => {
    return hasERC1155Transfers.value || hasERC721Transfers.value
})
/**
 * Computed Property of token ids to be fetch meta
 */
const tokenIDS = computed<NftId[]>(() => {
    const _ids: NftId[] = []
    if (transferType.value !== TransferType.Erc20 && hasNftTransfers.value) {
        if (transferType.value === TransferType.Erc721) {
            erc721TokenTransfer.value?.transfers.forEach(transfer => {
                if (transfer) {
                    const id = {
                        id: generateId(transfer.tokenId),
                        contract: transfer.contract
                    }
                    _ids.push(id)
                }
            })
        } else if (transferType.value === TransferType.Erc1155) {
            erc1155TokenTransfers.value?.transfers.forEach(transfer => {
                if (transfer) {
                    const id = {
                        id: generateId(transfer.tokenId),
                        contract: transfer.contract
                    }
                    _ids.push(id)
                }
            })
        }
    }
    return _ids
})
const { nftMeta, loadingMeta } = useGetNftsMeta(tokenIDS, loadingTransfers)

/**------------------------
 * Transfers
 -------------------------*/

const initialLoad = computed<boolean>(() => {
    return !erc721TokenTransferResult.value || !erc20TokenTransferResult.value || !erc1155TokenTransferResult.value
})
const transferData = computed<TokenTransferFragment[] | Erc721TransferFragment[] | Erc1155TokenTransferFragment[] | Array<null>>(() => {
    if (!initialLoad.value) {
        const data = !hasNftTransfers.value
            ? erc20TokenTransfer.value?.transfers.filter((x): x is TokenTransferFragment => x !== null)
            : hasERC1155Transfers.value
            ? erc1155TokenTransfers.value?.transfers.filter((x): x is Erc1155TokenTransferFragment => x !== null)
            : erc721TokenTransfer.value?.transfers.filter((x): x is Erc721TransferFragment => x !== null)
        if (data) {
            return data
        }
    }
    return []
})

const { numberOfPages, pageData: currentPageData, setPageNum, pageNum } = useAppPaginate(transferData, 'tokenTransfers')

const loading = computed<boolean>(() => {
    return loadingErc20TokenTransfer.value || loadingErc721TokenTransfer.value || loadingErc1155TokenTransfer.value || loadingMeta.value
})

const hasMore = computed<boolean>(() => {
    return hasMoreERC721Transfers.value || hasMoreERC20Transfers.value || hasMoreERC1155Transfers.value
})

const showPagination = computed<boolean>(() => {
    return !initialLoad.value || hasItems.value || !!tokenIDS.value.length
})

const hasItems = computed<boolean>(() => {
    return !!(transferData.value && transferData.value.length)
})

const nextKey = computed<string | null | undefined>(() => {
    if (transferType.value === TransferType.Erc20) {
        return erc20TokenTransfer.value?.nextKey
    }
    if (transferType.value === TransferType.Erc721) {
        return erc721TokenTransfer.value?.nextKey
    }
    if (transferType.value === TransferType.Erc1155) {
        return erc1155TokenTransfers.value?.nextKey
    }
    return undefined
})
/**
 * Emit error to Sentry
 * @param val {Boolean}
 * @param isErc20 {Boolean}
 */
const emitErrorState = (val: boolean, isErc20 = false): void => {
    state.hasError = val
    const message = isErc20 ? ErrorMessageToken.erc20Transfers : ErrorMessageToken.erc721Transfers
    emit('errorDetails', val, message)
}

/**
 * Sets page number and reset value and emit
 * @param page {Number}
 * @param reset {Boolean}
 */
const setPage = (page: number, reset = false): void => {
    if (reset) {
        state.isEnd = 0
        refetchErc20TokenTransfer()
        refetchErc721TokenTransfer()
        refetchErc1155TokenTransfer()
    } else {
        if (page > state.isEnd) {
            fetchMoreTransfers(page)
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
const updateQueryParse = <T extends Erc20TokenTransfersFragment | Erc721TokenTransfersFragment | Erc1155TokenTransfersFragment>(
    prev: T,
    more: T | undefined
) => {
    const prevTransfers = prev.transfers
    const moreTransfers = more ? more.transfers : []
    const nextKey = more ? more.nextKey : undefined
    return {
        nextKey: nextKey,
        transfers: [...prevTransfers, ...moreTransfers],
        __typename: prev.__typename
    }
}

/**
 * Fetched More Transfers based on the curent contract type. Sets index to the last page
 * @param page - page number that is being fetched
 */
const fetchMoreTransfers = async (page: number): Promise<boolean> => {
    try {
        const _params = {
            _contract: props.address,
            _limit: ITEMS_PER_PAGE,
            _nextKey: nextKey.value
        }
        switch (transferType.value) {
            case TransferType.Erc20:
                await fetchMoreErc20TokenTransfer({
                    variables: _params,
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        return {
                            __typename: 'Query',
                            getERC20TokenTransfers: updateQueryParse(
                                previousResult.getERC20TokenTransfers,
                                fetchMoreResult?.getERC20TokenTransfers
                            ) as Erc20TokenTransfersFragment
                        }
                    }
                })
                break
            case TransferType.Erc721:
                await fetchMoreErc721TokenTransfer({
                    variables: _params,
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        return {
                            __typename: 'Query',
                            getERC721TokenTransfers: updateQueryParse(
                                previousResult.getERC721TokenTransfers,
                                fetchMoreResult?.getERC721TokenTransfers
                            ) as Erc721TokenTransfersFragment
                        }
                    }
                })
                break
            default:
                await fetchMoreErc1155TokenTransfer({
                    variables: _params,
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        return {
                            __typename: 'Query',
                            getERC1155TokenTransfers: updateQueryParse(
                                previousResult.getERC1155TokenTransfers,
                                fetchMoreResult?.getERC1155TokenTransfers
                            ) as Erc1155TokenTransfersFragment
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
</script>
