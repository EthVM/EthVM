<template>
    <v-card :variant="isBlock ? 'flat' : 'elevated'" :elevation="isBlock ? 0 : 1" rounded="xl" class="pa-4 pa-sm-6">
        <v-card-title
            v-if="(isHome || state.newMinedTransfers || tableTitle) && !isBlock"
            :class="[isHome ? 'mb-2 mb-sm-4' : 'mb-2 mb-sm-5', 'px-0  py-0 d-flex align-center justify-space-between']"
        >
            <div class="d-flex align-center">
                <h1 v-if="tableTitle" class="text-h6 font-weight-bold">
                    {{ tableTitle }}
                </h1>
                <app-new-update
                    v-if="!isHome && !isBlock"
                    icon-only
                    :text="$t('txs.refresh')"
                    :update-count="state.newMinedTransfers"
                    @reload="setPage(1, true)"
                    hide-count
                />
            </div>
            <app-btn v-if="isHome && !xs" :text="$t('txs.more')" isSmall icon="east" @click="goToTransactionsPage"></app-btn>
            <app-btn-icon v-else-if="isHome && xs" icon="east" @click="goToTransactionsPage"></app-btn-icon>
        </v-card-title>
        <txs-table
            :max-items="props.maxItems"
            :initial-load="initialLoad"
            :is-loading="isLoading"
            :table-message="message"
            :txs-data="currentPageData"
            :is-scroll-view="isHome"
            :show-intersect="showPagination"
            :has-more="hasMore"
            :pages="numberOfPages"
            :is-block="isBlock"
            @loadMore="loadMoreData"
        />
    </v-card>
</template>

<script setup lang="ts">
import AppBtn from '@core/components/AppBtn.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import AppNewUpdate from '@core/components/AppNewUpdate.vue'
import {
    useGetAllTxsQuery,
    useNewTransfersCompleteFeedSubscription,
    useGetBlockTransfersQuery,
    TransferFragment,
    EthTransfersFragment,
    BlockTransactionsFragment,
    BlockTransactionFragment
} from './apollo/transfersQuery.generated'
import { computed, onMounted, reactive, watch } from 'vue'
import TxsTable from '@module/txs/components/TxsTable.vue'
import { ROUTE_NAME } from '@core/router/routesNames'
import { useRouter } from 'vue-router'
import { useAppPaginate } from '@core/composables/AppPaginate/useAppPaginate.composable'
import { useDisplay } from 'vuetify'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const { xs } = useDisplay()

interface ModuleState {
    refetching: boolean
    isEnd: number
    newMinedTransfers: number
    hasError: boolean
}

const state: ModuleState = reactive({
    isEnd: 1,
    newMinedTransfers: 0,
    hasError: false,
    refetching: false
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

const isBlock = computed<boolean>(() => {
    return props.pageType === 'blockDetails'
})

/*
 * =======================================================
 * NETWORK CALLS/HANDLER
 * =======================================================
 */
const {
    result: getEthTransactionTransfers,
    loading: loadingTxs,
    refetch: refetchTxArray,
    fetchMore: fetchMoreTxs
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
    loading: loadingBlockTransfers,
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

const allEthTransfers = computed<EthTransfersFragment | undefined>(() => {
    return getEthTransactionTransfers.value?.getEthTransactionTransfers
})

const allBlockTransfersResult = computed<BlockTransactionsFragment | undefined>(() => {
    return getAllBlockTransfersResult.value?.getBlockTransfers
})

const transactions = computed<Array<TransferFragment | BlockTransactionFragment>>(() => {
    if (!isBlock.value && allEthTransfers.value && allEthTransfers.value.transfers !== null) {
        return allEthTransfers.value.transfers
    }
    if (isBlock.value && allBlockTransfersResult.value && allBlockTransfersResult.value.transfers !== null) {
        return allBlockTransfersResult.value.transfers.filter((x): x is BlockTransactionFragment => x !== null)
    }
    return []
})

const { numberOfPages, pageData: currentPageData, setPageNum } = useAppPaginate(transactions)

const message = computed<string>(() => {
    return ''
})

const tableTitle = computed<string>(() => {
    if (isBlock.value) {
        return ''
    }
    return isHome.value ? t('txs.isHomeHeader') : t('txs.header')
})

const isHome = computed<boolean>(() => {
    return props.pageType === 'home'
})

const hasMore = computed<boolean>(() => {
    if (isBlock.value) {
        return false
    }
    return !!allEthTransfers.value?.nextKey
})

const showPagination = computed<boolean>(() => {
    if (isHome.value) {
        return false
    }

    if (isBlock.value) {
        return !!getAllBlockTransfersResult.value && transactions.value.length > 0
    }

    return !state.refetching && !!allEthTransfers.value?.nextKey && transactions.value.length > 0
})

const isLoading = computed<boolean>(() => {
    return loadingTxs.value || loadingBlockTransfers.value
})

const initialLoad = computed<boolean>(() => {
    if (isBlock.value) {
        return !getAllBlockTransfersResult.value
    }
    return !getEthTransactionTransfers.value
})

const { onResult: onNewTransferLoaded } = useNewTransfersCompleteFeedSubscription()

onNewTransferLoaded(result => {
    if (result?.data?.newTransfersCompleteFeed.type === 'ETH') {
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
    setPageNum(page)
    if (reset) {
        state.isEnd = 1
        state.newMinedTransfers = 0
        state.refetching = true
        await refetchTxArray()
        state.refetching = false
    } else {
        if (page > state.isEnd && hasMore.value) {
            await fetchMoreTxs({
                variables: {
                    _nextKey: allEthTransfers.value?.nextKey,
                    _limit: props.maxItems
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                    state.isEnd = page
                    const newT = fetchMoreResult?.getEthTransactionTransfers.transfers
                    const prevT = previousResult.getEthTransactionTransfers.transfers
                    if (newT) {
                        return {
                            ...previousResult,
                            getEthTransactionTransfers: {
                                __typename: previousResult.getEthTransactionTransfers.__typename,
                                nextKey: fetchMoreResult?.getEthTransactionTransfers.nextKey,
                                transfers: [...prevT, ...newT]
                            }
                        }
                    }
                    return {
                        ...previousResult,
                        getEthTransactionTransfers: {
                            __typename: previousResult.getEthTransactionTransfers.__typename,
                            nextKey: previousResult.getEthTransactionTransfers.nextKey,
                            transfers: [...prevT]
                        }
                    }
                }
            })
        }
    }

    setPageNum(page)
    return true
}

const router = useRouter()
const goToTransactionsPage = async (): Promise<void> => {
    await router.push({
        name: ROUTE_NAME.TXS.NAME
    })
}

const loadMoreData = (pageNum: number) => {
    setPage(pageNum)
}

onMounted(() => {
    state.hasError = false
    refetchBlockTransfers()
})

watch(
    () => props.blockRef,
    () => {
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
