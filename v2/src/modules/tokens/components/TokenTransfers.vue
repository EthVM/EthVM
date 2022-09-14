<template>
    <token-transfers-table
        :transfers="transferData"
        :loading="loading"
        :show-pagination="showPagination"
        :decimals="props.decimals"
        :symbol="props.symbol"
        :max-items="MAX_ITEMS"
        :has-more="showPagination"
        :has-items="hasItems"
        :index="state.index"
        :has-error="state.hasError"
        :transfer-type="transferType"
        @setPage="setPage"
    />
</template>

<script setup lang="ts">
import TokenTransfersTable from '@module/tokens/components/TokenDetailsTransfer/TokenTransferTable.vue'
import { ErrorMessageToken } from '@module/tokens/models/ErrorMessagesForTokens'
import { excpInvariantViolation } from '@/apollo/errorExceptions'
import { reactive, computed, defineEmits } from 'vue'
import {
    TokenTransfersFragment as Erc20TokenTransfersType,
    useGetErc20TokenTransfersQuery,
    useGetErc721TokenTransfersQuery
} from '@module/tokens/apollo/TokenDetailsTransfer/tokenTransfers.generated'

const TYPES = ['ERC20', 'ERC721']

const MAX_ITEMS = 10

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
    initialLoad: boolean
    hasError: boolean
}
const state: ComponentState = reactive({
    page: 0,
    index: 0,
    isEnd: 0,
    initialLoad: true,
    hasError: false
})

const {
    result: erc20TokenTransferResult,
    loading: loadingErc20TokenTransfer,
    fetchMore: fetchMoreErc20TokenTransfer,
    refetch: refetchErc20TokenTransfer,
    onError: onErc20TokenTransferError
} = useGetErc20TokenTransfersQuery(
    () => ({
        hash: props.address,
        _limit: MAX_ITEMS
    }),
    { notifyOnNetworkStatusChange: true }
)

const erc20TokenTransfer = computed<Erc20TokenTransfersType | undefined>(() => {
    return erc20TokenTransferResult.value?.getERC20TokenTransfers
})

const {
    result: erc721TokenTransferResult,
    loading: loadingErc721TokenTransfer,
    fetchMore: fetchMoreErc721TokenTransfer,
    refetch: refetchErc721TokenTransfer,
    onError: onErc721TokenTransferError
} = useGetErc721TokenTransfersQuery(
    () => ({
        hash: props.address,
        _limit: MAX_ITEMS
    }),
    { notifyOnNetworkStatusChange: true }
)

const erc721TokenTransfer = computed(() => {
    return erc721TokenTransferResult.value?.getERC721TokenTransfers
})

onErc20TokenTransferError(() => {
    emitErrorState(true, true)
})

onErc721TokenTransferError(() => {
    emitErrorState(true, true)
})

const hasERC721Transfers = computed<boolean>(() => {
    return !!erc721TokenTransfer.value && erc721TokenTransfer.value.transfers.length > 0
})

const transferData = computed<any[]>(() => {
    if (erc20TokenTransfer.value && erc721TokenTransfer.value) {
        const data = hasERC721Transfers.value ? erc721TokenTransfer.value.transfers : erc20TokenTransfer.value.transfers
        const start = state.index * MAX_ITEMS
        const end = start + MAX_ITEMS > data.length ? data.length : start + MAX_ITEMS
        return data.slice(start, end)
    }
    return []
})

const transferType = computed<string>(() => {
    return hasERC721Transfers.value ? TYPES[1] : TYPES[0]
})

const loading = computed<boolean>(() => {
    return loadingErc20TokenTransfer.value || loadingErc721TokenTransfer.value
})

const hasMoreERC20Transfers = computed<boolean>(() => {
    return erc20TokenTransfer.value ? erc20TokenTransfer.value.nextKey !== null : false
})

const hasMoreERC721Transfers = computed<boolean>(() => {
    return erc721TokenTransfer.value ? erc721TokenTransfer.value.nextKey !== null : false
})

const showPagination = computed<boolean>(() => {
    return hasMoreERC721Transfers.value || hasMoreERC20Transfers.value
})

const hasItems = computed<boolean>(() => {
    return !!(transferData.value && transferData.value.length)
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
    } else {
        if (page > state.isEnd) {
            hasMoreERC20Transfers.value ? getERC20Transfer(page) : null
            hasMoreERC721Transfers.value ? getERC721Transfer(page) : null
        }
    }
    state.index = page
}

/**
 * Gets ERC20 through apollo
 * @param page {Number}
 */
const getERC20Transfer = async (page: number): Promise<boolean> => {
    try {
        await fetchMoreErc20TokenTransfer({
            variables: {
                hash: props.address,
                _limit: 10,
                _nextKey: erc20TokenTransfer.value?.nextKey
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
                state.isEnd = page
                const prevT = previousResult.getERC20TokenTransfers.transfers
                if (fetchMoreResult) {
                    const newT = fetchMoreResult.getERC20TokenTransfers.transfers
                    return {
                        getERC20TokenTransfers: {
                            nextKey: fetchMoreResult.getERC20TokenTransfers.nextKey,
                            transfers: [...prevT, ...newT],
                            __typename: fetchMoreResult.getERC20TokenTransfers.__typename
                        }
                    }
                }
                return {
                    getERC20TokenTransfers: {
                        nextKey: previousResult.getERC20TokenTransfers.nextKey,
                        transfers: [...prevT],
                        __typename: previousResult.getERC20TokenTransfers.__typename
                    }
                }
            }
        })
        return true
    } catch (e) {
        const newE = JSON.stringify(e)
        if (!newE.toLowerCase().includes(excpInvariantViolation)) {
            throw new Error(newE)
        }
        return false
    }
}

/**
 * Gets ERC721 through apollo
 * @param page {Number}
 */
const getERC721Transfer = async (page: number): Promise<boolean> => {
    try {
        await fetchMoreErc721TokenTransfer({
            variables: {
                hash: props.address,
                _limit: 10,
                _nextKey: erc721TokenTransfer.value?.nextKey
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
                state.isEnd = page
                const prevT = previousResult.getERC721TokenTransfers.transfers
                if (fetchMoreResult) {
                    const newT = fetchMoreResult.getERC721TokenTransfers.transfers
                    return {
                        getERC721TokenTransfers: {
                            nextKey: fetchMoreResult.getERC721TokenTransfers.nextKey,
                            transfers: [...prevT, ...newT],
                            __typename: fetchMoreResult.getERC721TokenTransfers.__typename
                        }
                    }
                }
                return {
                    getERC721TokenTransfers: {
                        nextKey: previousResult.getERC721TokenTransfers.nextKey,
                        transfers: [...prevT],
                        __typename: previousResult.getERC721TokenTransfers.__typename
                    }
                }
            }
        })
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
