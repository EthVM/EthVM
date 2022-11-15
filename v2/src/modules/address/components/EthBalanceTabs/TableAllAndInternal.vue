<template>
    <template v-if="!smAndDown">
        <v-row align="center" justify="start" class="text-info mt-2 mt-sm-6">
            <template v-if="props.tab === routes[0]">
                <v-col sm="3" lg="2">
                    <span style="width: 30px; height: 1px" class="d-inline-block"></span>
                    <span class="ml-4">Tx Value</span>
                </v-col>
                <v-col v-if="!mdAndDown" sm="2"> Type </v-col>
                <v-col sm="2"> Hash/Block </v-col>
                <v-col sm="2"> To/From </v-col>
                <v-col sm="3" lg="2"> Address </v-col>
                <v-col sm="2"> Tx Fee Paid </v-col>
            </template>
            <template v-if="props.tab === routes[1]">
                <v-col :sm="mdAndDown ? 3 : 2">
                    <span style="width: 30px; height: 1px" class="d-inline-block"></span>
                    <span class="ml-4">Tx Value</span>
                </v-col>
                <v-spacer />
                <v-col md="3" lg="2"> Address </v-col>
                <v-col sm="2"> Hash </v-col>
                <v-col sm="2"> Balance Before </v-col>
                <v-col sm="2" lg="3"> Balance After </v-col>
            </template>
        </v-row>
        <v-divider class="my-0 mt-md-4 mx-n4 mx-sm-n6" />
    </template>
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
import {
    EthInternalTransactionTransfersFragment,
    useGetEthInternalTransactionTransfersQuery
} from '@module/address/apollo/EthTransfers/internalTransfers.generated'
import { useDisplay } from 'vuetify'
import { useGetAllEthTransfersQuery } from '@module/address/apollo/EthTransfers/allTransfers.generated'

const routes = Q_ADDRESS_TRANSFERS
const MAX_ITEMS = 50
const { smAndDown, mdAndDown } = useDisplay()

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
} = useGetEthInternalTransactionTransfersQuery(
    () => ({
        hash: props.addressRef,
        _limit: MAX_ITEMS
    }),
    () => ({
        fetchPolicy: 'network-only',
        enabled: isItxEnabled.value
    })
)

const {
    result: allTransfersData,
    loading: loadingAllTransfersData,
    fetchMore: fetchMoreAllTransfersData
} = useGetAllEthTransfersQuery(
    () => ({
        hash: props.addressRef,
        _limit: MAX_ITEMS
    }),
    () => ({
        fetchPolicy: 'network-only',
        enabled: !isItxEnabled.value
    })
)

const transfers = computed<Array<EthInternalTransactionTransfersFragment | null> | undefined | null>(() => {
    if (props.tab === routes[1]) {
        return internalTransfersData.value?.getEthInternalTransactionTransfers.transfers
    } else if (props.tab === routes[0]) {
        return allTransfersData.value?.getAllEthTransfers.transfers
    }
    return null
})

const initialLoad = computed<boolean>(() => {
    if (props.tab === routes[1]) {
        return !internalTransfersData.value
    } else if (props.tab === routes[0]) {
        return !allTransfersData.value
    }
    return false
})

const hasMore = computed<boolean>(() => {
    if (props.tab === routes[1]) {
        return !!internalTransfersData.value?.getEthInternalTransactionTransfers.nextKey
    } else if (props.tab === routes[0]) {
        return !!allTransfersData.value?.getAllEthTransfers.nextKey
    }
    return false
})

const loadMoreItxData = (): void => {
    fetchMoreInternalTransfersData({
        variables: {
            hash: props.addressRef,
            _limit: MAX_ITEMS,
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

const loadMoreAllEthData = (): void => {
    fetchMoreAllTransfersData({
        variables: {
            hash: props.addressRef,
            _limit: MAX_ITEMS,
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

const loadMoreData = (e: boolean): void => {
    if (props.tab === routes[1]) {
        if (hasMore.value && e) {
            loadMoreItxData()
        }
    } else if (props.tab === routes[0]) {
        if (hasMore.value && e) {
            loadMoreAllEthData()
        }
    }
}
</script>
