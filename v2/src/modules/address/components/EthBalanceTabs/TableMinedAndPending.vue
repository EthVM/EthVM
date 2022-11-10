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
    <template v-if="initialLoad">
        <div v-for="item in 10" :key="item" class="my-2">
            <div class="skeleton-box rounded-xl mt-1 my-4" style="height: 24px"></div>
        </div>
    </template>
    <template v-else>
        <div v-if="pendingTxs.length < 1">
            <app-no-result text="This address does not have pending transactions" class="mt-4 mt-sm-6" />
        </div>
        <template v-else>
            <div v-for="tx in pendingTxs" :key="tx.hash">
                <table-mined-and-pending-row :tx="tx" :addressRef="props.addressRef" />
            </div>
        </template>
    </template>
</template>

<script setup lang="ts">
import AppNoResult from '@core/components/AppNoResult.vue'
import TableMinedAndPendingRow from '@module/address/components/EthBalanceTabs/TableMinedAndPendingRow.vue'
import { computed } from 'vue'
import { Q_ADDRESS_TRANSFERS } from '@/core/router/routesNames'
import { PendingTxsFragmentFragment, useGetPendingTransactionsQuery } from '@module/address/apollo/EthTransfers/pendingTransfers.generated'
import { useDisplay } from 'vuetify'

const routes = Q_ADDRESS_TRANSFERS
const { smAndDown } = useDisplay()

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

const { result: pendingTxsData, loading } = useGetPendingTransactionsQuery(() => ({
    hash: props.addressRef
}))

const initialLoad = computed<boolean>(() => {
    return !pendingTxsData.value
})

const pendingTxs = computed<Array<PendingTxsFragmentFragment | null>>(() => {
    // return pendingTxsData.value?.getPendingTransactions
    return [
        {
            __typename: 'Tx',
            baseFeePerGas: null,
            blockHash: null,
            blockNumber: null,
            contractAddress: null,
            from: '0xddfabcdc4d8ffc6d5beaf154f18b778f892a0740',
            gas: '0x5208',
            gasPrice: '0x1e80355e00',
            gasUsed: null,
            hash: '0x1a2e76f8eba473ee295a61897b4fb6612431b51332a5b367bff24268a7b3e282',
            input: '0x',
            logs: [],
            maxFeePerGas: '0x1e80355e00',
            maxPriorityFeePerGas: '0x77359400',
            nonce: 7145587,
            r: '0x635af74f73e59e1bab0fd92612609c304ad257ebbcb6835c16eb618a15b7b2d2',
            replacedBy: null,
            s: '0x1ee5a54b7079f20c5f73c098dfdcfb91c026a6dcf65c73d435703d89adf102b0',
            status: null,
            timestamp: 1668013561,
            to: '0xc2fa40c3dd8f9e9f4c749ea99810671abc04845d',
            trace: [],
            transactionIndex: null,
            v: '0x1',
            value: '0x3bf3495a5af000'
        }
    ]
})
</script>
