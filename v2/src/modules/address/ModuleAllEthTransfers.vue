<template>
    <template v-if="!smAndDown">
        <v-row align="center" justify="start" class="text-info mt-2 mt-sm-6">
            <v-col sm="3" lg="2">
                <span style="width: 30px; height: 1px" class="d-inline-block"></span>
                <span class="ml-4">Tx Value</span>
            </v-col>
            <v-col v-if="!mdAndDown" sm="2"> Type </v-col>
            <v-col sm="2"> Hash/Block </v-col>
            <v-col sm="2"> To/From </v-col>
            <v-col sm="3" lg="2"> Address </v-col>
            <v-col sm="2"> Tx Fee Paid </v-col>
        </v-row>
        <v-divider class="my-0 mt-md-4 mx-n4 mx-sm-n6" />
    </template>
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
            <div class="skeleton-box rounded-xl" style="height: 40px"></div>
        </div>
    </div>
    <template v-if="hasMore & !initialLoad">
        <app-pagination :length="numberOfPages" :has-next="hasMore" @update:modelValue="loadMoreData" :current-page="pageNum" />
    </template>
</template>

<script setup lang="ts">
import AppNoResult from '@core/components/AppNoResult.vue'
import TableAllEthTransferRow from '@module/address/components/EthBalanceTabs/TableAllEthTransferRow.vue'
import AppPagination from '@core/components/AppPagination.vue'
import { computed, watch } from 'vue'
import { EthInternalTransactionTransfersFragment } from '@module/address/apollo/EthTransfers/internalTransfers.generated'
import { useDisplay } from 'vuetify'
import { useGetAllEthTransfersQuery } from '@module/address/apollo/EthTransfers/allTransfers.generated'
import { useAppPaginate } from '@core/composables/AppPaginate/useAppPaginate.composable'
import { ITEMS_PER_PAGE } from '@core/constants'

const { smAndDown, mdAndDown } = useDisplay()

const props = defineProps({
    addressRef: {
        type: String,
        required: true
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

const transfers = computed<Array<EthInternalTransactionTransfersFragment | null>>(() => {
    return allTransfersData.value?.getAllEthTransfers.transfers || []
})

const { numberOfPages, pageData: currentPageData, setPageNum, pageNum } = useAppPaginate(transfers, 'allTxs')

const initialLoad = computed<boolean>(() => {
    return !allTransfersData.value
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
