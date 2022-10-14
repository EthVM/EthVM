<template>
    <v-row align="center" justify="start" class="text-info mt-2 mt-sm-6">
        <v-col sm="2">
            <span style="width: 30px; height: 1px" class="d-inline-block"></span>
            <span class="ml-6">Tx Value</span>
        </v-col>
        <v-col :sm="props.tab === routes[0] ? 2 : 1"> Timestamp </v-col>
        <v-spacer />
        <template v-if="props.tab === routes[1]">
            <v-col sm="2"> Address </v-col>
            <v-col sm="2"> Hash </v-col>
        </template>
        <v-col sm="2"> Balance Before </v-col>
        <v-col sm="2"> Balance After </v-col>
        <template v-if="props.tab === routes[0]">
            <v-col sm="4">Type</v-col>
        </template>
    </v-row>
    <v-divider class="my-0 mt-md-4 mx-n4 mx-sm-n6" />
    <template v-if="!initialLoad">
        <template v-if="transfers && transfers.length > 0">
            <div v-for="transfer in transfers" :key="transfer.transfer.transactionHash">
                <table-all-and-internal-row :tab="props.tab" :loading="initialLoad" :transfer="transfer" :address-ref="props.addressRef" />
            </div>
        </template>
        <app-no-result v-else text="This address does not have any internal transfers" class="mt-4 mt-sm-6 mb-5"></app-no-result>
        <app-intersect v-if="hasMore" @intersect="loadMoreData">
            <div class="skeleton-box rounded-xl mt-1 my-4" style="height: 24px"></div>
            <v-divider />
        </app-intersect>
    </template>
    <template v-else>
        <div v-for="item in 10" :key="item" class="my-2">
            <div class="skeleton-box rounded-xl my-5" style="height: 24px"></div>
        </div>
    </template>
</template>

<script setup lang="ts">
import AppIntersect from '@/core/components/AppIntersect.vue'
import AppNoResult from '@/core/components/AppNoResult.vue'
import TableAllAndInternalRow from '@module/address/components/EthBalanceTabs/TableAllAndInternalRow.vue'
import { computed } from 'vue'
import { Q_ADDRESS_TRANSFERS } from '@/core/router/routesNames'
import { EthItxTransfersFragment, useGetEthItxTransfersQuery } from '@module/address/apollo/EthTransfers/internalTransfers.generated'

const routes = Q_ADDRESS_TRANSFERS
const MAX_ITEMS = 10

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

const isItxEnabled = computed<boolean>(() => {
    return props.tab === routes[1]
})

const {
    result: internalTransfersData,
    loading: loadingInternalTransfersData,
    fetchMore: fetchMoreInternalTransfersData
} = useGetEthItxTransfersQuery(
    () => ({
        hash: props.addressRef
    }),
    () => ({
        fetchPolicy: 'network-only',
        enabled: isItxEnabled
    })
)

const transfers = computed<EthItxTransfersFragment | undefined | null>(() => {
    if (props.tab === routes[1]) {
        return internalTransfersData.value?.getEthItxTransfers.transfers
    }
    return null
})

const initialLoad = computed<boolean>(() => {
    if (props.tab === routes[1]) {
        return !internalTransfersData.value
    }
    return false
})

const hasMore = computed<boolean>(() => {
    if (props.tab === routes[1]) {
        return !!internalTransfersData.value?.getEthItxTransfers.nextKey
    }
    return false
})

const loadMoreItxData = (): void => {
    fetchMoreInternalTransfersData({
        variables: {
            hash: props.addressRef,
            _limit: MAX_ITEMS,
            _nextKey: internalTransfersData.value?.getEthItxTransfers.nextKey
        },
        updateQuery: (prev, { fetchMoreResult }) => {
            return {
                getEthItxTransfers: {
                    nextKey: fetchMoreResult?.getEthItxTransfers.nextKey,
                    transfers: [...prev.getEthItxTransfers.transfers, ...(fetchMoreResult?.getEthItxTransfers.transfers || [])],
                    __typename: fetchMoreResult?.getEthItxTransfers.__typename
                }
            }
        }
    })
}

const loadMoreData = (e: boolean): void => {
    if (hasMore.value && e) {
        loadMoreItxData()
    }
}
</script>
