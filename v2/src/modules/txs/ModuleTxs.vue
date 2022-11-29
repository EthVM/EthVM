<template>
    <v-card :variant="isHome ? 'elevated' : 'flat'" :elevation="isHome ? 1 : 0" rounded="xl" class="pa-4 pa-sm-6">
        <v-card-title v-if="isHome || state.newMinedTransfers || tableTitle" class="px-0 mb-5 d-flex align-center justify-space-between">
            <div class="d-flex align-center">
                <h1 v-if="tableTitle" class="text-h6 font-weight-bold">{{ tableTitle }}</h1>
                <app-new-update v-if="!isHome" icon-only text="New Txs" :update-count="state.newMinedTransfers" @reload="setPage(0, true)" />
            </div>
            <app-btn v-if="isHome" text="More" isSmall icon="east" @click="goToTransactionsPage"></app-btn>
        </v-card-title>
        <txs-table
            class="mt-5"
            :max-items="props.maxItems"
            :index="state.index"
            :is-loading="state.initialLoad"
            :table-message="message"
            :txs-data="transactions"
            :is-scroll-view="isHome"
            :show-intersect="showPagination"
            :is-block="isBlock"
            @loadMore="loadMoreData"
        />
    </v-card>
</template>

<script setup lang="ts">
import AppBtn from '@core/components/AppBtn.vue'
import AppNewUpdate from '@core/components/AppNewUpdate.vue'
import {
    useGetAllTxsQuery,
    useNewTransfersCompleteFeedSubscription,
    useGetBlockTransfersQuery,
    TransferFragment,
    EthTransfersFragment
} from './apollo/transfersQuery.generated'
import { computed, onMounted, reactive, watch } from 'vue'
import TxsTable from '@module/txs/components/TxsTable.vue'
import BN from 'bignumber.js'
import { Q_BLOCKS_AND_TXS, ROUTE_NAME } from '@core/router/routesNames'
import { useRouter } from 'vue-router'

interface ModuleState {
    initialLoad: boolean
    index: number
    isEnd: number
    newMinedTransfers: number
    hasError: boolean
}

const state: ModuleState = reactive({
    initialLoad: true,
    index: 0,
    isEnd: 0,
    newMinedTransfers: 0,
    hasError: false
})

const props = defineProps({
    maxItems: Number,
    blockRef: {
        type: String
    },
    pageType: {
        type: String,
        default: 'home'
    },
    isMined: {
        type: Boolean,
        default: false
    }
})

/*
 * =======================================================
 * COMPUTED
 * =======================================================
 */
const transactions = computed<Array<TransferFragment | null>>(() => {
    if (!isBlock.value && allEthTransfers.value && allEthTransfers.value.transfers !== null) {
        return allEthTransfers.value.transfers
    }
    if (isBlock.value && allBlockTransfersResult.value && allBlockTransfersResult.value.transfers !== null) {
        return allBlockTransfersResult.value.transfers
    }
    return []
})

const totalPages = computed<number>(() => {
    if (isBlock.value) {
        return Math.ceil(new BN(transactions.value.length).div(props.maxItems || 10).toNumber())
    }
    return 0
})

const message = computed<string>(() => {
    return ''
})

const tableTitle = computed<string>(() => {
    if (isBlock.value) {
        return ''
    }
    return isHome.value ? 'Last Transactions' : 'All Transactions'
})

const isHome = computed<boolean>(() => {
    return props.pageType === 'home'
})

const isBlock = computed<boolean>(() => {
    return props.pageType === 'blockDetails'
})

const hasMore = computed<boolean>(() => {
    if (isBlock.value) {
        return state.index < totalPages.value
    }
    return !!allEthTransfers.value?.nextKey
})

const showPagination = computed<boolean>(() => {
    if (isHome.value) {
        return false
    }

    return hasMore.value
})

/*
 * =======================================================
 * NETWORK CALLS/HANDLER
 * =======================================================
 */
const {
    result: getAllEthTransfers,
    onResult: onTxsArrayLoaded,
    refetch: refetchTxArray,
    fetchMore
} = useGetAllTxsQuery(
    {
        _limit: props.maxItems,
        _nextKey: null
    },
    {
        notifyOnNetworkStatusChange: true,
        enabled: !isBlock.value
    }
)

const enableBlockTranfersQuery = computed<boolean>(() => {
    return props.isMined && isBlock.value
})

const {
    result: getAllBlockTransfersResult,
    onResult: onBlockTransfersArrayLoaded,
    refetch: refetchBlockTransfers
} = useGetBlockTransfersQuery(
    () => ({
        _number: props.blockRef ? parseInt(props.blockRef) : undefined
    }),
    () => ({
        notifyOnNetworkStatusChange: true,
        enabled: enableBlockTranfersQuery.value
    })
)

onBlockTransfersArrayLoaded(data => {
    // data.loading is going to be true when the block hasn't been mined and the useGetBlockTransfersQuery is skipped
    if (!data.loading) {
        setTimeout(() => {
            state.initialLoad = false
        }, 1000)
    }
})

const { onResult: onNewTransferLoaded } = useNewTransfersCompleteFeedSubscription()

const allEthTransfers = computed<EthTransfersFragment | undefined>(() => {
    return getAllEthTransfers.value?.getAllEthTransfers
})

const allBlockTransfersResult = computed<EthTransfersFragment | undefined>(() => {
    return getAllBlockTransfersResult.value?.getBlockTransfers
})

onTxsArrayLoaded(() => {
    state.initialLoad = false
})

onNewTransferLoaded(result => {
    if (result?.data.newTransfersCompleteFeed.type === 'ETH') {
        if (isHome.value) {
            refetchTxArray()
        } else {
            state.newMinedTransfers += 1
        }
    }
})

/*
 * =======================================================
 * METHODS
 * =======================================================
 */
const setPage = async (page: number, reset = false): Promise<boolean> => {
    state.index = page
    if (reset) {
        state.isEnd = 0
        if (isHome.value) {
            state.newMinedTransfers = 0
        }
        await refetchTxArray()
    } else {
        if (page >= state.isEnd && hasMore.value) {
            await fetchMore({
                variables: {
                    nextKey: allEthTransfers.value?.nextKey,
                    _limit: props.maxItems
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                    state.isEnd = page
                    const newT = fetchMoreResult?.getAllEthTransfers.transfers
                    const prevT = previousResult.getAllEthTransfers.transfers
                    if (newT) {
                        return {
                            ...previousResult,
                            getAllEthTransfers: {
                                __typename: previousResult.getAllEthTransfers.__typename,
                                nextKey: fetchMoreResult?.getAllEthTransfers.nextKey,
                                transfers: [...prevT, ...newT]
                            }
                        }
                    }
                    return {
                        ...previousResult,
                        getAllEthTransfers: {
                            __typename: previousResult.getAllEthTransfers.__typename,
                            nextKey: previousResult.getAllEthTransfers.nextKey,
                            transfers: [...prevT]
                        }
                    }
                }
            })
        }
    }

    state.index = page
    return true
}

const router = useRouter()
const goToTransactionsPage = async (): Promise<void> => {
    await router.push({
        name: ROUTE_NAME.ALL_BLOCKS_AND_TXS.NAME,
        query: { t: Q_BLOCKS_AND_TXS[1] }
    })
}

const loadMoreData = () => {
    setPage(state.index + 1)
}

onMounted(() => {
    state.initialLoad = true
    state.hasError = false
    refetchBlockTransfers()
})

watch(
    () => props.blockRef,
    () => {
        state.initialLoad = true
        state.hasError = false
        refetchBlockTransfers({ _number: parseInt(props.blockRef) })
    }
)
</script>
<style scoped lang="css">
.tx-filter-select-container {
    border: solid 1px #efefef;
    padding-top: 1px;
}
.tx-status {
    min-width: 60px;
}
</style>
