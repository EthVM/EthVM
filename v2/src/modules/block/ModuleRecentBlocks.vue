<template>
    <v-card variant="elevated" :elevation="1" rounded="xl" class="pa-4 pa-sm-6">
        <v-card-title :class="[isHome ? 'mb-2 mb-sm-4' : 'mb-2 mb-sm-5', 'px-0  py-0 d-flex align-center justify-space-between']">
            <div class="d-flex align-center">
                <h1 class="text-h6 font-weight-bold">{{ getTitle }}</h1>
                <notice-new-block v-if="!isHome" @reload="setPage(1, true)" />
            </div>
            <app-btn v-if="isHome && !xs" text="More" isSmall icon="east" @click="goToBlocksPage"></app-btn>
            <app-btn-icon v-else-if="isHome && xs" icon="east" @click="goToBlocksPage"></app-btn-icon>
        </v-card-title>
        <table-blocks
            :max-items="ITEMS_PER_PAGE"
            :index="pageNum"
            :initial-load="state.initialLoad"
            :is-loading="loading"
            :table-message="message"
            :block-data="currentPageData"
            :is-scroll-view="isHome"
            :show-intersect="showPagination"
            :has-more="hasMore"
            :pages="numberOfPages"
            @loadMore="loadMoreData"
        />
    </v-card>
</template>

<script setup lang="ts">
import AppBtn from '@core/components/AppBtn.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import TableBlocks from '@/modules/block/components/RecentBlocks/BlocksTable.vue'
import NoticeNewBlock from '@/modules/block/components/RecentBlocks/NoticeNewBlock.vue'
import BN from 'bignumber.js'
import {
    useGetBlocksArrayByNumberQuery,
    GetBlocksArrayByNumberQuery as TypeBlocks,
    BlockSummaryFragment,
    NewBlockTableDocument,
    GetBlocksArrayByNumberQuery,
    NewBlockTableSubscription
} from './apollo/RecentBlocks/recentBlocks.generated'
import { computed, reactive, onMounted } from 'vue'
import { ROUTE_NAME } from '@core/router/routesNames'
import { useRouter } from 'vue-router'
import { ITEMS_PER_PAGE } from '@core/constants'
import { useAppPaginate } from '@core/composables/AppPaginate/useAppPaginate.composable'
import { useDisplay } from 'vuetify'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const { xs } = useDisplay()

const props = defineProps({
    pageType: {
        type: String,
        default: 'home'
    }
})

const isHome = computed<boolean>(() => {
    return props.pageType === 'home'
})

interface BlockMap {
    [key: number]: TypeBlocks
}

interface ComponentState {
    initialLoad: boolean
    hasError: boolean
    indexedBlocks: BlockMap
    totalPages: number
    startBlock: number
}

const state: ComponentState = reactive({
    initialLoad: true,
    hasError: false,
    indexedBlocks: {},
    totalPages: 0,
    startBlock: 0
})

/*
 * =======================================================
 * COMPUTED
 * =======================================================
 */

const message = computed<string>(() => {
    return ''
})

const getTitle = computed<string>(() => {
    const titles = {
        blocks: t('block.allBlockTitle'),
        address: t('block.addressBlockTitle'),
        home: t('block.lastBlockTitle')
    }
    return titles[props.pageType]
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
        limit: ITEMS_PER_PAGE
    }),
    { notifyOnNetworkStatusChange: true }
)
interface SubscriptionRes {
    data: NewBlockTableSubscription
}
function subscribeToMoreHandler() {
    return {
        document: NewBlockTableDocument,
        updateQuery: (previousResult: GetBlocksArrayByNumberQuery, { subscriptionData }: { subscriptionData: SubscriptionRes }) => {
            if (previousResult && subscriptionData.data.newBlockFeed) {
                const prevB = [...previousResult.getBlocksArrayByNumber.slice(0)]
                const newB = { ...subscriptionData.data.newBlockFeed, txFail: 0 }
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
                    getBlocksArrayByNumber: isHome.value ? [newB, ...prevB].slice(0, 10) : [newB, ...prevB]
                }
            }
        }
    }
}

const blocks = computed<Array<BlockSummaryFragment | null> | []>(() => {
    if (blockArrays.value && !state.initialLoad) {
        return blockArrays.value.getBlocksArrayByNumber
    }
    return []
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

const { numberOfPages, pageData: currentPageData, setPageNum, pageNum } = useAppPaginate(blocks)

const showPagination = computed<boolean>(() => {
    return !state.initialLoad && !isHome.value && blocks.value.length > 0
})

const hasMore = computed<boolean>(() => {
    return state.startBlock - ITEMS_PER_PAGE > 0
})

/*
 * =======================================================
 * METHODS
 * =======================================================
 */
const setPage = async (page: number, reset = false): Promise<boolean> => {
    setPageNum(page)
    if (reset) {
        state.indexedBlocks = {}
        state.initialLoad = true
        await refetchBlockArray()
    } else {
        const from = state.startBlock - ITEMS_PER_PAGE * (pageNum.value - 1)
        if (from >= 0 && !state.indexedBlocks[pageNum.value]) {
            await fetchMore({
                variables: {
                    fromBlock: from,
                    limit: ITEMS_PER_PAGE
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
            state.startBlock = result.data.getBlocksArrayByNumber[0]?.number || 0
            setPageNum(1)
            state.totalPages = Math.ceil(new BN(state.startBlock + 1).div(ITEMS_PER_PAGE).toNumber())
        }
        if (props.pageType === 'home') {
            if (result.data.getBlocksArrayByNumber.length > 1) {
                if (result.data.getBlocksArrayByNumber[0].number - result.data.getBlocksArrayByNumber[1].number > 1) {
                    refetchBlockArray()
                }
            }
        }
        const newBlocks = result.data.getBlocksArrayByNumber
        state.indexedBlocks[pageNum.value] = props.pageType === 'home' ? newBlocks.slice(0, ITEMS_PER_PAGE) : newBlocks
    }
})

const loadMoreData = (pageNum: number) => {
    setPage(pageNum)
}

const router = useRouter()
const goToBlocksPage = async (): Promise<void> => {
    await router.push({
        name: ROUTE_NAME.BLOCKS.NAME
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
