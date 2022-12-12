<template>
    <v-row class="px-1 my-3">
        <div class="mr-3">
            <v-btn
                color="textPrimary"
                :variant="state.transferDirection === TransferDirection.Incoming ? 'flat' : 'outlined'"
                density="compact"
                rounded="pill"
                class="px-2"
                height="24"
                @click="setTransferDirection(TransferDirection.Incoming)"
            >
                Incoming
            </v-btn>
        </div>
        <div class="mx-3">
            <v-btn
                color="textPrimary"
                :variant="state.transferDirection === TransferDirection.Outgoing ? 'flat' : 'outlined'"
                density="compact"
                rounded="pill"
                class="px-2"
                height="24"
                @click="setTransferDirection(TransferDirection.Outgoing)"
            >
                Outgoing
            </v-btn>
        </div>
        <div class="mx-3">
            <v-btn
                color="textPrimary"
                :variant="state.transferDirection === null ? 'flat' : 'outlined'"
                density="compact"
                rounded="pill"
                class="px-2"
                height="24"
                @click="setTransferDirection('')"
            >
                All
            </v-btn>
        </div>
    </v-row>
    <template v-if="!smAndDown">
        <v-row align="center" justify="start" class="text-info mt-2 mt-sm-6">
            <v-col sm="3" lg="2">
                <span style="width: 30px; height: 1px" class="d-inline-block"></span>
                <span class="ml-4">Tx Value</span>
            </v-col>
            <v-col v-if="!mdAndDown" sm="2"> To/From </v-col>
            <v-spacer v-else />
            <v-col sm="3"> Address </v-col>
            <v-col sm="2"> Hash</v-col>
            <v-col sm="3"> Balance Change </v-col>
        </v-row>
        <v-divider class="my-0 mt-md-4 mx-n4 mx-sm-n6" />
    </template>
    <template v-if="!initialLoad">
        <template v-if="transfers && transfers.length > 0">
            <div v-for="transfer in transfers" :key="transfer.transfer.transactionHash">
                <table-txs-history-row :loading="initialLoad" :transfer="transfer" :address-ref="props.addressRef" />
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
import AppBtn from '@core/components/AppBtn.vue'
import AppIntersect from '@core/components/AppIntersect.vue'
import AppNoResult from '@core/components/AppNoResult.vue'
import TableTxsHistoryRow from '@module/address/components/EthBalanceTabs/TableTxsHistoryRow.vue'
import { computed, reactive } from 'vue'
import { Q_ADDRESS_TRANSFERS } from '@core/router/routesNames'
import { useDisplay } from 'vuetify'
import { TxsTransfersFragment, useGetEthTransactionTransfersQuery } from '@module/address/apollo/EthTransfers/transfersHistory.generated'
import { TransferDirection } from '@/apollo/types'
import { formatVariableUnitEthValue } from '@core/helper/number-format-helper'
import BN from 'bignumber.js'

const routes = Q_ADDRESS_TRANSFERS
const MAX_ITEMS = 50
const { smAndDown, mdAndDown } = useDisplay()

const props = defineProps({
    addressRef: {
        type: String,
        required: true
    }
})

interface ComponentState {
    transferDirection: TransferDirection | null
}

const state: ComponentState = reactive({
    transferDirection: null
})

const {
    result: txsTransfersData,
    loading: loadingTxsTransfersData,
    fetchMore: fetchMoreTxsTransfersData
} = useGetEthTransactionTransfersQuery(
    () => ({
        ...(state.transferDirection !== null && { direction: state.transferDirection }),
        hash: props.addressRef,
        _limit: MAX_ITEMS
    }),
    () => ({
        notifyOnNetworkStatusChange: true
    })
)

const transfers = computed<Array<TxsTransfersFragment | null> | undefined | null>(() => {
    return txsTransfersData.value?.getEthTransactionTransfers.transfers
})

const initialLoad = computed<boolean>(() => {
    return !txsTransfersData.value
})

const hasMore = computed<boolean>(() => {
    return !!txsTransfersData.value?.getEthTransactionTransfers.nextKey
})

const loadMoreTxsTransfersData = (): void => {
    fetchMoreTxsTransfersData({
        variables: {
            direction: state.transferDirection,
            hash: props.addressRef,
            _limit: MAX_ITEMS,
            _nextKey: txsTransfersData.value?.getEthTransactionTransfers.nextKey
        },
        updateQuery: (prev, { fetchMoreResult }) => {
            return {
                getEthTransactionTransfers: {
                    nextKey: fetchMoreResult?.getEthTransactionTransfers.nextKey,
                    transfers: [...prev.getEthTransactionTransfers.transfers, ...(fetchMoreResult?.getEthTransactionTransfers.transfers || [])],
                    __typename: fetchMoreResult?.getEthTransactionTransfers.__typename
                }
            }
        }
    })
}

const loadMoreData = (e: boolean): void => {
    if (hasMore.value && e) {
        loadMoreTxsTransfersData()
    }
}

const setTransferDirection = (direction: TransferDirection): void => {
    if (direction) {
        state.transferDirection = direction
    } else {
        state.transferDirection = null
    }
}
</script>
