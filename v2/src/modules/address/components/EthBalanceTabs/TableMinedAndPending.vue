<template>
    <v-row align="center" justify="start" class="text-info mt-2 mt-sm-6">
        <v-col sm="2">
            <span class="mr-6">Status</span>
            <span>Tx Value</span>
        </v-col>
        <v-col sm="2"> Timestamp </v-col>
        <v-col sm="2"> To/From </v-col>
        <v-col sm="2"> Address </v-col>
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
    <div v-for="i in 5" :key="i">
        <table-mined-and-pending-row :tab="props.tab" />
    </div>
</template>

<script setup lang="ts">
import TableMinedAndPendingRow from '@module/address/components/EthBalanceTabs/TableMinedAndPendingRow.vue'
import { Q_ADDRESS_TRANSFERS } from '@/core/router/routesNames'

const routes = Q_ADDRESS_TRANSFERS

const props = defineProps({
    tab: {
        type: String,
        required: true
    }
})
</script>
