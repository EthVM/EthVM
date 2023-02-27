<template>
    <v-card v-if="props.txHash" variant="flat" rounded="xl" class="px-4 px-sm-6 pb-4 pb-sm-6">
        <div>
            <!-- Table Header -->
            <v-row :dense="xs" align="center" justify="start" class="text-body-1 text-info d-none d-sm-flex">
                <v-col lg="2"> Address </v-col>
                <v-spacer />
                <v-col v-if="!mdAndDown" md="3"> Before </v-col>
                <v-col v-if="!mdAndDown" md="3"> After </v-col>
                <v-col lg="2"> State Difference </v-col>
            </v-row>
            <v-divider class="my-0 mt-md-4 mx-n4 mx-sm-n6" />
            <!-- End Table Header -->
            <template v-if="loading || props.txStatus === TxStatus.pending">
                <div v-for="i in 5" :key="i" class="skeleton-box rounded-xl my-4" style="height: 24px"></div>
            </template>
            <div v-else>
                <template v-if="!stateDiff || stateDiff.length < 1">
                    <app-no-result text="No transaction state difference avaialble" class="mt-5" />
                </template>
                <template v-else>
                    <div v-for="(diff, index) in stateDiff" :key="index">
                        <table-tab-state-row :diff="diff" />
                    </div>
                </template>
            </div>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import AppNoResult from '@core/components/AppNoResult.vue'
import TableTabStateRow from '@module/txs/components/TableTabStateRow.vue'
import { StateDiffFragmentFragment as StateDiffType, useGetTransactionStateDiffQuery } from '@module/address/apollo/AddressTransfers/transfers.generated'
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { TxStatus } from '@module/txs/models/ErrorMessagesForTx'

const { mdAndDown, xs } = useDisplay()

interface ComponentProps {
    txHash: string
    loading: boolean
    txStatus: TxStatus
}
const props = defineProps<ComponentProps>()

const { result: stateDiffResult, loading } = useGetTransactionStateDiffQuery(() => ({
    hash: props.txHash
}))

const stateDiff = computed<Array<StateDiffType | null> | undefined>(() => {
    return stateDiffResult.value?.getTransactionStateDiff
})
</script>
