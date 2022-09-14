<template>
    <v-card class="pt-3 pb-3">
        <v-container fluid>
            <app-table-title :title="getTitle" :has-pagination="showPagination" :page-type="props.pageType" page-link="/txs">
                <template v-if="!isHome && !isBlock" #update>
                    <app-new-update text="New Txs" :update-count="state.newMinedTransfers" :hide-count="true" @reload="setPage(0, true)" />
                </template>
                <template v-if="showPagination" #pagination>
                    <app-paginate v-if="isBlock" :total="totalPages" :current-page="state.index" @newPage="setPage" />
                    <app-paginate-has-more v-else :has-more="hasMore" :current-page="state.index" :loading="loading" @newPage="setPage" />
                </template>
            </app-table-title>
            <txs-table
                :max-items="props.maxItems"
                :index="state.index"
                :is-loading="loading"
                :table-message="message"
                :txs-data="transactions"
                :is-scroll-view="isHome"
            />
            <v-row v-if="showPagination" justify="end" row class="pb-1 pr-3 pl-2">
                <app-paginate v-if="isBlock" :total="totalPages" :current-page="state.index" @newPage="setPage" />
                <app-paginate-has-more v-else :has-more="hasMore" :current-page="state.index" :loading="loading" @newPage="setPage" />
            </v-row>
        </v-container>
    </v-card>
</template>

<script setup lang="ts">
import AppTableTitle from '@core/components/AppTableTitle.vue'
import AppNewUpdate from '@core/components/AppNewUpdate.vue'
import AppPaginateHasMore from '@core/components/AppPaginateHasMore.vue'
import AppPaginate from '@core/components/AppPaginate.vue'
import {
    useGetAllTxsQuery,
    useNewTransfersCompleteFeedSubscription,
    useGetBlockTransfersQuery,
    TxSummaryFragment,
    EthTransfersFragment
} from './apollo/transfersQuery.generated'
import { computed, onMounted, reactive, watch } from 'vue'
import TxsTable from '@module/txs/components/TxsTable.vue'
import BN from 'bignumber.js'

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
        type: String,
        required: true
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
const transactions = computed(() => {
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
        return Math.ceil(new BN(transactions.value.length).div(props.maxItems).toNumber())
    }
    return 0
})

const message = computed<string>(() => {
    return ''
})

const getTitle = computed<string>(() => {
    return isBlock.value ? 'Block Transactions' : 'Last Transactions'
})

const loading = computed<boolean>(() => {
    if (state.hasError) {
        return true
    }
    if (isHome.value || isBlock.value) {
        return state.initialLoad || loadingBlockTxs.value
    }
    return loadingTxs.value
})

const isHome = computed<boolean>(() => {
    return props.pageType === 'home'
})

const isBlock = computed<boolean>(() => {
    return props.pageType === 'blockDetails'
})

const hasMore = computed<boolean>(() => {
    if (!isHome.value) {
        return allEthTransfers.value ? !(allEthTransfers.value.nextKey === null) : false
    }
    return false
})

const showPagination = computed<boolean>(() => {
    if (isHome.value) {
        return false
    }

    if (isBlock.value) {
        return totalPages.value > 1
    }

    return hasMore.value
})

/*
 * =======================================================
 * NETWORK CALLS/HANDLER
 * =======================================================
 */
const {
    loading: loadingTxs,
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

const {
    loading: loadingBlockTxs,
    result: getAllBlockTransfersResult,
    onResult: onBlockTransfersArrayLoaded,
    refetch: refetchBlockTransfers
} = useGetBlockTransfersQuery(
    () => ({
        _number: props.blockRef ? parseInt(props.blockRef) : undefined
    }),
    {
        notifyOnNetworkStatusChange: true,
        enabled: props.isMined && isBlock.value
    }
)

onBlockTransfersArrayLoaded(() => {
    state.initialLoad = false
})

const { onResult: onNewTransferLoaded } = useNewTransfersCompleteFeedSubscription()

const allEthTransfers = computed<EthTransfersFragment | undefined>(() => {
    return getAllEthTransfers.value?.getAllEthTransfers
})

const allBlockTransfersResult = computed<TxSummaryFragment | undefined>(() => {
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
