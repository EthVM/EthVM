<template>
    <v-card :variant="isHome ? 'elevated' : 'flat'" :elevation="isHome ? 1 : 0" rounded="xl" class="pa-4 pa-sm-6">
        <v-card-title class="px-0 mb-5 d-flex align-center justify-space-between">
            <div class="d-flex align-center">
                <h1 class="text-h6 font-weight-bold">{{ getTitle }}</h1>
                <notice-new-block v-if="!isHome" @reload="setPage(0, true)" />
            </div>
            <app-btn v-if="isHome" text="More" isSmall icon="east" @click="goToBlocksPage"></app-btn>
        </v-card-title>
        <table-blocks
            :class="isHome && !smAndDown ? 'pt-13' : null"
            :max-items="props.maxItems"
            :index="state.index"
            :is-loading="state.initialLoad"
            :table-message="message"
            :block-data="blocks"
            :is-scroll-view="isHome"
            :show-intersect="showPagination"
            @loadMore="loadMoreData"
        />
    </v-card>
</template>

<script setup lang="ts">
import AppBtn from '@core/components/AppBtn.vue'
import TableBlocks from '@/modules/block/components/RecentBlocks/BlocksTable.vue'
import NoticeNewBlock from '@/modules/block/components/RecentBlocks/NoticeNewBlock.vue'
import BN from 'bignumber.js'
import {
    useGetBlocksArrayByNumberQuery,
    GetBlocksArrayByNumberQuery as TypeBlocks,
    NewBlockTableDocument,
    GetBlocksArrayByNumberQuery,
    NewBlockTableSubscription
} from './apollo/RecentBlocks/recentBlocks.generated'
import { computed, reactive, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import { Q_BLOCKS_AND_TXS, ROUTE_NAME } from '@core/router/routesNames'
import { useRouter } from 'vue-router'
const { smAndDown } = useDisplay()

interface BlockMap {
    [key: number]: TypeBlocks
}

interface ComponentState {
    initialLoad: boolean
    hasError: boolean
    indexedBlocks: BlockMap
    index: number
    totalPages: number
    startBlock: number
}

const state: ComponentState = reactive({
    initialLoad: true,
    hasError: false,
    indexedBlocks: {},
    index: 0,
    totalPages: 0,
    startBlock: 0
})

const props = defineProps({
    maxItems: Number,
    pageType: {
        type: String,
        default: 'home'
    }
})

/*
 * =======================================================
 * COMPUTED
 * =======================================================
 */
const blocks = computed<TypeBlocks | []>(() => {
    if (blockArrays.value && !state.initialLoad) {
        return blockArrays.value.getBlocksArrayByNumber
    }
    return []
})

const message = computed<string>(() => {
    return ''
})

const getTitle = computed<string>(() => {
    const titles = {
        blocks: 'All Blocks',
        address: 'Mined Blocks',
        home: 'Last Blocks'
    }
    return titles[props.pageType]
})

const loading = computed<boolean>(() => {
    if (state.hasError) {
        return true
    }
    if (isHome.value) {
        return state.initialLoad
    }
    return loadingBlocks.value
})

const isHome = computed<boolean>(() => {
    return props.pageType === 'home'
})

const currentPage = computed<number>(() => {
    return state.index
})

const showPagination = computed<boolean>(() => {
    return !state.initialLoad && !isHome.value && state.startBlock - props.maxItems > 0
})

/*
 * =======================================================
 * NETWORK CALLS/HANDLER
 * =======================================================
 */
const {
    result: blockArrays,
    loading: loadingBlocks,
    onResult: onBlockArrayLoaded,
    subscribeToMore,
    refetch: refetchBlockArray,
    fetchMore
} = useGetBlocksArrayByNumberQuery(
    () => ({
        limit: props.maxItems
    }),
    { notifyOnNetworkStatusChange: true }
)

function subscribeToMoreHandler() {
    return {
        document: NewBlockTableDocument,
        updateQuery: (previousResult: GetBlocksArrayByNumberQuery, { subscriptionData }: { subscriptionData: NewBlockTableSubscription }) => {
            if (previousResult && subscriptionData.data.newBlockFeed) {
                const prevB = [...previousResult.getBlocksArrayByNumber.slice(0)]
                const newB = subscriptionData.data.newBlockFeed
                newB.txFail = 0
                const index = prevB.findIndex(block => block?.number === newB.number)
                if (index != -1) {
                    prevB.splice(index, 1, newB)
                    return {
                        __typename: 'BlockSummary',
                        getBlocksArrayByNumber: prevB
                    }
                }
                return {
                    __typename: 'BlockSummary',
                    getBlocksArrayByNumber: [newB, ...prevB]
                }
            }
        }
    }
}

/*
 * =======================================================
 * METHODS
 * =======================================================
 */
const setPage = async (page: number, reset = false): Promise<boolean> => {
    state.index = page
    if (reset) {
        state.indexedBlocks = {}
        state.initialLoad = true
        await refetchBlockArray()
    } else {
        const from = state.startBlock - props.maxItems * state.index
        if (from >= 0 && !state.indexedBlocks[state.index]) {
            await fetchMore({
                variables: {
                    fromBlock: from,
                    limit: props.maxItems
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                    return {
                        getBlocksArrayByNumber: [...previousResult.getBlocksArrayByNumber, ...fetchMoreResult.getBlocksArrayByNumber]
                    }
                }
            })
        }
    }
    return true
}

onBlockArrayLoaded(result => {
    if (!result.loading) {
        if (state.initialLoad) {
            state.initialLoad = false
            state.startBlock = result.data.getBlocksArrayByNumber[0].number
            state.index = 0
            state.totalPages = Math.ceil(new BN(state.startBlock + 1).div(props.maxItems).toNumber())
        }
        if (props.pageType === 'home') {
            if (result.data.getBlocksArrayByNumber[0].number - result.data.getBlocksArrayByNumber[1].number > 1) {
                refetchBlockArray()
            }
        }
        const newBlocks = result.data.getBlocksArrayByNumber
        state.indexedBlocks[state.index] = props.pageType === 'home' ? newBlocks.slice(0, props.maxItems) : newBlocks
    }
})

const loadMoreData = () => {
    setPage(state.index + 1)
}

const router = useRouter()
const goToBlocksPage = async (): Promise<void> => {
    await router.push({
        name: ROUTE_NAME.ALL_BLOCKS_AND_TXS.NAME,
        query: { t: Q_BLOCKS_AND_TXS[0] }
    })
}

onMounted(() => {
    if (isHome.value) {
        subscribeToMore(subscribeToMoreHandler)
    }
    refetchBlockArray()
})
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
