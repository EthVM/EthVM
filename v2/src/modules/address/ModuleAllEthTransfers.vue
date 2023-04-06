<template>
    <template v-if="!xs">
        <v-row align="center" justify="start" class="text-info mt-2 mt-sm-3">
            <v-col sm="4" md="3" lg="2" order="1"> Status </v-col>
            <v-col sm="5" md="3" lg="2" order="2"> Address </v-col>
            <v-col sm="3" lg="2" order-sm="last" order-lg="3"> Value </v-col>
            <v-col lg="2" class="d-none d-lg-flex" order="4"> Tx Fee Paid </v-col>
            <v-col sm="3" class="d-none d-lg-flex" lg="2" order="5"> Type </v-col>
            <v-col md="3" lg="2" class="d-none d-md-flex" order-md="3" order-lg="6"> Hash/Block </v-col>
        </v-row>
    </template>
    <v-divider class="my-0 mt-sm-4 mx-n4 mx-sm-n6" />

    <div v-if="!initialLoad && !loadingAllTransfersData" class="p-ten-top">
        <template v-if="transfers && transfers.length > 0">
            <div v-for="(transfer, index) in currentPageData" :key="`${transfer.transfer.transactionHash}-${index}`">
                <table-all-eth-transfer-row :transfer="transfer" :address-ref="props.addressRef" />
            </div>
        </template>
        <app-no-result v-else text="This address does not have any transfers" class="mt-4 mt-sm-6 mb-5"></app-no-result>
    </div>
    <div v-else class="p-ten-top">
        <div v-for="item in 10" :key="item" style="padding: 10px 0">
            <div class="skeleton-box rounded-xl" :style="xs ? 'height: 56px' : 'height: 46px'"></div>
        </div>
    </div>
    <template v-if="showPagination">
        <app-pagination :length="numberOfPages" :has-more="hasMore" @update:modelValue="loadMoreData" :current-page="pageNum" />
    </template>
</template>

<script setup lang="ts">
import AppNoResult from '@core/components/AppNoResult.vue'
import TableAllEthTransferRow from '@module/address/components/EthBalanceTabs/TableAllEthTransferRow.vue'
import AppPagination from '@core/components/AppPagination.vue'
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useGetAllEthTransfersQuery, AllEthTransfersFragment } from '@module/address/apollo/EthTransfers/allTransfers.generated'
import { useAppPaginate } from '@core/composables/AppPaginate/useAppPaginate.composable'
import { ITEMS_PER_PAGE } from '@core/constants'

const { xs } = useDisplay()

const props = defineProps({
    addressRef: {
        type: String,
        required: true
    },
    isOverview: {
        type: Boolean,
        default: false
    }
})

const {
    result: allTransfersData,
    loading: loadingAllTransfersData,
    fetchMore: fetchMoreAllTransfersData
} = useGetAllEthTransfersQuery(
    () => ({
        hash: props.addressRef,
        _limit: ITEMS_PER_PAGE
    }),
    {
        notifyOnNetworkStatusChange: true
    }
)

const transfers = computed<AllEthTransfersFragment[]>(() => {
    if (allTransfersData.value && allTransfersData.value.getAllEthTransfers) {
        return allTransfersData.value.getAllEthTransfers.transfers.filter((x): x is AllEthTransfersFragment => x !== null)
    }
    return []
})

const { numberOfPages, pageData: currentPageData, setPageNum, pageNum } = useAppPaginate(transfers, 'allTxs')

const initialLoad = computed<boolean>(() => {
    return !allTransfersData.value
})

const showPagination = computed<boolean>(() => {
    return !props.isOverview && !initialLoad.value && transfers.value && transfers.value.length > 0
})

const hasMore = computed<boolean>(() => {
    return !!allTransfersData.value?.getAllEthTransfers.nextKey
})

const loadMoreAllEthData = (): void => {
    fetchMoreAllTransfersData({
        variables: {
            hash: props.addressRef,
            _limit: ITEMS_PER_PAGE,
            _nextKey: allTransfersData.value?.getAllEthTransfers.nextKey
        },
        updateQuery: (prev, { fetchMoreResult }) => {
            return {
                getAllEthTransfers: {
                    nextKey: fetchMoreResult?.getAllEthTransfers.nextKey,
                    transfers: [...prev.getAllEthTransfers.transfers, ...(fetchMoreResult?.getAllEthTransfers.transfers || [])],
                    __typename: fetchMoreResult?.getAllEthTransfers.__typename
                }
            }
        }
    })
}

const loadMoreData = (pageNum: number): void => {
    setPageNum(pageNum)
    if (pageNum > numberOfPages.value && hasMore.value) {
        loadMoreAllEthData()
    }
}
</script>
