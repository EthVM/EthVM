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
    <div v-for="i in 5" :key="i">
        <table-all-and-internal-row :tab="props.tab" />
    </div>
</template>

<script setup lang="ts">
import TableAllAndInternalRow from '@module/address/components/EthBalanceTabs/TableAllAndInternalRow.vue'
import { Q_ADDRESS_TRANSFERS } from '@/core/router/routesNames'

const routes = Q_ADDRESS_TRANSFERS

const props = defineProps({
    tab: {
        type: String,
        required: true
    }
})
</script>
