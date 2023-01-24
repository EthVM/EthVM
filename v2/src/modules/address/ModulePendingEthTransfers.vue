<template>
    <template v-if="!smAndDown">
        <v-row align="center" justify="start" class="text-info mt-2 mt-sm-6">
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
        <v-divider class="my-0 mt-md-4 mx-n4 mx-sm-n6" />
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
        <v-divider class="my-0 mt-md-4 mx-n4 mx-sm-n6" />
    </template>
    <div v-if="initialLoad" class="p-ten-top">
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
            <app-pagination :length="numberOfPages" :has-next="hasMore" @update:modelValue="loadMoreData" :current-page="pageNum" />
        </div>
    </template>
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

const { result: pendingTxsData } = useGetPendingTransactionsQuery(() => ({
    hash: props.addressRef
}))

const initialLoad = computed<boolean>(() => {
    return !pendingTxsData.value
})

const pendingTxs = computed<Array<PendingTxsFragmentFragment | null> | undefined>(() => {
    return pendingTxsData.value?.getPendingTransactions
})

const hasMore = computed<boolean>(() => {
    return !!pendingTxsData.value?.getPendingTransactions.nextKey
})

const { numberOfPages, pageData: currentPageData, setPageNum, pageNum } = useAppPaginate(pendingTxs, 'pendingTxs')

const loadMoreData = (pageNum: number) => {
    console.log(pageNum)
}
</script>
