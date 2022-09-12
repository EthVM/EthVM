<template>
    <token-holders-table
        :holders="holders"
        :loading="loading"
        :show-pagination="showPagination"
        :decimals="props.decimals"
        :max-items="MAX_ITEMS"
        :has-more="showPagination"
        :has-items="hasItems"
        :index="state.index"
        :has-error="state.hasError"
        :address="props.address"
        :holder-type="holderType"
        @setPage="setPage"
    />
</template>

<script setup lang="ts">
import TokenHoldersTable from '@module/tokens/components/TokenDetailsHolder/TokenHolderTable.vue'
import { ErrorMessageToken } from '@module/tokens/models/ErrorMessagesForTokens'
import { excpInvariantViolation } from '@/apollo/errorExceptions'
import { reactive, computed, defineEmits } from 'vue'
import {
    Erc20TokenOwnersFragment as Erc20TokenOwnersType,
    Erc721TokenOwnersFragment as Erc721TokenOwnersType,
    useGetErc20TokenOwnersQuery,
    useGetErc721TokenOwnersQuery
} from '@module/tokens/apollo/TokenDetailsHolder/tokenHolders.generated'

const TYPES = ['ERC20', 'ERC721']

const MAX_ITEMS = 10

interface PropType {
    address: string
    decimals?: number
}
const props = defineProps<PropType>()

const emit = defineEmits<{
    (e: 'errorDetails', value: boolean, message: string): void
    (e: 'isNft', value: boolean): void
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
    result: erc20TokenHolderResult,
    loading: loadingErc20TokenHolder,
    fetchMore: fetchMoreErc20TokenHolder,
    refetch: refetchErc20TokenHolders,
    onError: onErc20TokenHoldersError
} = useGetErc20TokenOwnersQuery(
    () => ({
        contract: props.address,
        _limit: MAX_ITEMS
    }),
    { notifyOnNetworkStatusChange: true }
)

const erc20TokenHolders = computed<Erc20TokenOwnersType | undefined>(() => {
    return erc20TokenHolderResult.value?.getERC20TokenOwners
})

onErc20TokenHoldersError(() => {
    emitErrorState(true, true)
})

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
        _limit: MAX_ITEMS
    }),
    { notifyOnNetworkStatusChange: true }
)

const erc721TokenHolders = computed<Erc721TokenOwnersType | undefined>(() => {
    return erc721TokenHoldersResult.value?.getERC721TokenOwners
})

onErc721TokenHolderLoaded(({ data }) => {
    if (data.getERC721TokenOwners) {
        if (!data.getERC721TokenOwners.owners || data.getERC721TokenOwners.owners.length < 1) {
            emit('isNft', false)
        }
    }
})

onErc721TokenHolderError(() => {
    emitErrorState(true, true)
})

const hasERC721Owners = computed<boolean>(() => {
    return !!erc721TokenHolders.value && erc721TokenHolders.value?.owners.length > 0
})

const hasERC20Owners = computed<boolean>(() => {
    return !!erc20TokenHolders.value && erc20TokenHolders.value.owners
})

const holders = computed<any[]>(() => {
    if (hasERC20Owners.value && erc721TokenHolders.value) {
        const data = hasERC721Owners.value ? erc721TokenHolders.value.owners : erc20TokenHolders.value?.owners
        const start = state.index * MAX_ITEMS
        if (data) {
            const end = start + MAX_ITEMS > data.length ? data.length : start + MAX_ITEMS
            return data.slice(start, end)
        }
    }
    return []
})

const holderType = computed<string>(() => {
    return hasERC721Owners.value ? TYPES[1] : TYPES[0]
})

const loading = computed<boolean>(() => {
    return loadingErc20TokenHolder.value || loadingErc721TokenHolders.value
})

const hasMoreERC20Holders = computed<boolean>(() => {
    return erc20TokenHolders.value ? erc20TokenHolders.value.nextKey !== null : false
})

const hasMoreERC721Holders = computed<boolean>(() => {
    return erc721TokenHolders.value ? erc721TokenHolders.value.nextKey !== null : false
})

const showPagination = computed<boolean>(() => {
    return hasMoreERC721Holders.value || hasMoreERC20Holders.value
})

const hasItems = computed<boolean>(() => {
    return !!(holders.value && holders.value.length)
})

/**
 * Emit error to Sentry
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
    } else {
        if (page > state.isEnd && showPagination.value) {
            hasMoreERC20Holders.value ? getERC20Holder(page) : null
            hasMoreERC721Holders.value ? getERC721Holder(page) : null
        }
    }
    state.index = page
}

/**
 * Gets ERC20 through apollo
 * @param page {Number}
 */
const getERC20Holder = async (page: number): Promise<boolean> => {
    try {
        await fetchMoreErc20TokenHolder({
            variables: {
                contract: props.address,
                _limit: 10,
                _nextKey: erc20TokenHolders.value?.nextKey
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
                state.isEnd = page
                const prevT = previousResult.getERC20TokenOwners.owners
                if (fetchMoreResult) {
                    const newT = fetchMoreResult.getERC20TokenOwners.owners
                    return {
                        getERC20TokenOwners: {
                            nextKey: fetchMoreResult.getERC20TokenOwners.nextKey,
                            owners: [...prevT, ...newT],
                            __typename: fetchMoreResult.getERC20TokenOwners.__typename
                        }
                    }
                }
                return {
                    getERC20TokenOwners: {
                        nextKey: previousResult.getERC20TokenOwners.nextKey,
                        owners: [...prevT],
                        __typename: previousResult.getERC20TokenOwners.__typename
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
const getERC721Holder = async (page: number): Promise<boolean> => {
    try {
        await fetchMoreErc721TokenHolder({
            variables: {
                contract: props.address,
                _limit: 10,
                _nextKey: erc721TokenHolders.value?.nextKey
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
                state.isEnd = page
                const prevT = previousResult.getERC721TokenOwners.owners
                if (fetchMoreResult) {
                    const newT = fetchMoreResult.getERC721TokenOwners.owners
                    return {
                        getERC721TokenOwners: {
                            nextKey: fetchMoreResult.getERC721TokenOwners.nextKey,
                            owners: [...prevT, ...newT],
                            __typename: fetchMoreResult.getERC721TokenOwners.__typename
                        }
                    }
                }
                return {
                    getERC721TokenOwners: {
                        nextKey: previousResult.getERC721TokenOwners.nextKey,
                        owners: [...prevT],
                        __typename: previousResult.getERC721TokenOwners.__typename
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
