<template>
    <div>
        <template v-if="!smAndDown">
            <v-row align="center" justify="start" class="text-info mt-2 mt-sm-3">
                <v-col sm="3">
                    <span>Value</span>
                </v-col>
                <v-col sm="2"> To/From </v-col>
                <v-col sm="3"> Address </v-col>
                <v-col sm="2"> Hash </v-col>
                <template v-if="props.tab === routes[2]">
                    <v-col sm="2">
                        <div class="d-flex justify-space-between">
                            <span>Balance Change</span>
                            <span>Details</span>
                        </div>
                    </v-col>
                </template>
                <template v-else>
                    <v-col sm="2">Estimated Fee</v-col>
                </template>
            </v-row>
        </template>

        <template v-else-if="!xs">
            <v-row align="center" justify="start" class="text-info mt-2 mt-sm-6">
                <v-col sm="4">
                    <span>Value</span>
                </v-col>
                <v-col sm="3"> Address </v-col>
                <v-col sm="3"> Hash </v-col>
                <template v-if="props.tab === routes[2]">
                    <v-col sm="2">
                        <div class="d-flex justify-space-between">
                            <span>Balance Change</span>
                            <span>Details</span>
                        </div>
                    </v-col>
                </template>
                <template v-else>
                    <v-col sm="2">Estimated Fee</v-col>
                </template>
            </v-row>
        </template>
        <v-divider class="my-0 mt-4 mx-n4 mx-sm-n6" />
        <div v-if="initialLoad || loadingPendingTxs" class="p-ten-top">
            <div v-for="item in 10" :key="item" style="padding: 10px 0">
                <div class="skeleton-box rounded-xl" style="height: 40px"></div>
            </div>
        </div>
        <template v-else>
            <div v-if="pendingTxs && pendingTxs.length < 1">
                <app-no-result text="This address does not have pending transactions" class="mt-4 mt-sm-6" />
            </div>
            <div v-else class="p-ten-top">
                <div v-for="tx in currentPageData" :key="tx.hash">
                    <table-pending-row :tx="tx" :addressRef="props.addressRef" />
                </div>
            </div>
        </template>
        <template v-if="showPagination">
            <app-pagination :length="numberOfPages" :has-more="hasMore" @update:modelValue="loadMoreData" :current-page="pageNum" />
        </template>
    </div>
</template>

<script setup lang="ts">
import AppNoResult from '@core/components/AppNoResult.vue'
import TablePendingRow from '@module/address/components/EthBalanceTabs/TablePendingRow.vue'
import AppPagination from '@core/components/AppPagination.vue'
import { computed } from 'vue'
import { Q_ADDRESS_TRANSFERS } from '@core/router/routesNames'
import { PendingTxsFragmentFragment, useGetPendingTransactionsQuery } from '@module/address/apollo/EthTransfers/pendingTransfers.generated'
import { useDisplay } from 'vuetify'
import { useAppPaginate } from '@core/composables/AppPaginate/useAppPaginate.composable'
import { ITEMS_PER_PAGE } from '@core/constants'

const routes = Q_ADDRESS_TRANSFERS
const { smAndDown, xs } = useDisplay()

const props = defineProps({
    tab: {
        type: String,
        required: true
    },
    addressRef: {
        type: String,
        required: true
    }
})

const {
    result: pendingTxsData,
    fetchMore: fetchMorePendingTxsData,
    loading: loadingPendingTxs
} = useGetPendingTransactionsQuery(
    () => ({
        hash: props.addressRef,
        _nextKey: null
    }),
    {
        notifyOnNetworkStatusChange: true
    }
)

const initialLoad = computed<boolean>(() => {
    return !pendingTxsData.value
})

const pendingTxs = computed<Array<PendingTxsFragmentFragment | null>>(() => {
    return pendingTxsData.value?.getPendingTransactionsV2.items || []
})

const hasMore = computed<boolean>(() => {
    return !!pendingTxsData.value?.getPendingTransactionsV2.nextKey
})

const showPagination = computed<boolean>(() => {
    return !initialLoad.value && pendingTxs.value && pendingTxs.value.length > 0
})

const { numberOfPages, pageData: currentPageData, setPageNum, pageNum } = useAppPaginate(pendingTxs, 'pendingTxs')

const loadMorePendingTxs = (): void => {
    if (pageNum.value >= numberOfPages.value) {
        fetchMorePendingTxsData({
            variables: {
                hash: props.addressRef,
                _limit: ITEMS_PER_PAGE,
                _nextKey: pendingTxsData.value?.getPendingTransactionsV2.nextKey
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                return {
                    getPendingTransactionsV2: {
                        nextKey: fetchMoreResult?.getPendingTransactionsV2.nextKey,
                        items: [...prev.getPendingTransactionsV2.items, ...(fetchMoreResult?.getPendingTransactionsV2.items || [])],
                        __typename: fetchMoreResult?.getPendingTransactionsV2.__typename
                    }
                }
            }
        })
    }
}

const loadMoreData = (pageNum: number) => {
    setPageNum(pageNum)
    loadMorePendingTxs()
}
</script>
