<template>
    <div>
        <template v-if="!smAndDown">
            <v-row align="center" justify="start" class="text-info mt-2 mt-sm-3">
                <v-col :sm="mdAndDown ? 3 : 2">
                    <span style="width: 30px; height: 1px" class="d-inline-block"></span>
                    <span class="ml-4">Tx Value</span>
                </v-col>
                <v-spacer />
                <v-col md="3" lg="2"> Address </v-col>
                <v-col sm="2"> Hash </v-col>
                <v-col sm="2"> Balance Before </v-col>
                <v-col sm="2" lg="3"> Balance After </v-col>
            </v-row>
            <v-divider class="my-0 mt-md-4 mx-n4 mx-sm-n6" />
        </template>
        <div v-if="!initialLoad && !loadingInternalTransfersData" class="p-ten-top">
            <template v-if="transfers && transfers.length > 0">
                <div v-for="(transfer, index) in currentPageData" :key="`${transfer.transfer.transactionHash}-${index}`">
                    <table-internal-eth-transfer-row :transfer="transfer" :address-ref="props.addressRef" />
                </div>
            </template>
            <app-no-result v-else text="This address does not have any internal transfers" class="mt-4 mt-sm-6 mb-5"></app-no-result>
        </div>
        <div v-else class="p-ten-top">
            <div v-for="item in 10" :key="item" style="padding: 10px 0">
                <div class="skeleton-box rounded-xl" style="height: 40px"></div>
            </div>
        </div>
        <template v-if="showPagination">
            <app-pagination :length="numberOfPages" :has-more="hasMore" @update:modelValue="loadMoreData" :current-page="pageNum" />
        </template>
    </div>
</template>

<script setup lang="ts">
import AppNoResult from '@core/components/AppNoResult.vue'
import TableInternalEthTransferRow from '@module/address/components/EthBalanceTabs/TableInternalEthTransferRow.vue'
import AppPagination from '@core/components/AppPagination.vue'
import { computed } from 'vue'
import {
    EthInternalTransactionTransfersFragment,
    useGetEthInternalTransactionTransfersQuery
} from '@module/address/apollo/EthTransfers/internalTransfers.generated'
import { useDisplay } from 'vuetify'
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
    result: internalTransfersData,
    loading: loadingInternalTransfersData,
    fetchMore: fetchMoreInternalTransfersData
} = useGetEthInternalTransactionTransfersQuery(
    () => ({
        hash: props.addressRef,
        _limit: ITEMS_PER_PAGE
    }),
    {
        notifyOnNetworkStatusChange: true
    }
)

const transfers = computed<Array<EthInternalTransactionTransfersFragment | null>>(() => {
    return internalTransfersData.value?.getEthInternalTransactionTransfers.transfers || []
})

const { numberOfPages, pageData: currentPageData, setPageNum, pageNum } = useAppPaginate(transfers, 'internalTxs')

const initialLoad = computed<boolean>(() => {
    return !internalTransfersData.value
})

const showPagination = computed<boolean>(() => {
    return !initialLoad.value && transfers.value && transfers.value.length > 0
})

const hasMore = computed<boolean>(() => {
    return !!internalTransfersData.value?.getEthInternalTransactionTransfers.nextKey
})

const loadMoreItxData = (): void => {
    fetchMoreInternalTransfersData({
        variables: {
            hash: props.addressRef,
            _limit: ITEMS_PER_PAGE,
            _nextKey: internalTransfersData.value?.getEthInternalTransactionTransfers.nextKey
        },
        updateQuery: (prev, { fetchMoreResult }) => {
            return {
                getEthInternalTransactionTransfers: {
                    nextKey: fetchMoreResult?.getEthInternalTransactionTransfers.nextKey,
                    transfers: [...prev.getEthInternalTransactionTransfers.transfers, ...(fetchMoreResult?.getEthInternalTransactionTransfers.transfers || [])],
                    __typename: fetchMoreResult?.getEthInternalTransactionTransfers.__typename
                }
            }
        }
    })
}

const loadMoreData = (pageNum: number): void => {
    setPageNum(pageNum)
    if (pageNum > numberOfPages.value && hasMore.value) {
        loadMoreItxData()
    }
}
</script>
