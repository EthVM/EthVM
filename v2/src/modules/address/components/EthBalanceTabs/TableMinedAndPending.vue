<template>
    <v-row align="center" justify="start" class="text-body-1 text-info mt-2 mt-sm-5">
        <v-col sm="2">
            <span class="mr-6">Status</span>
            <span>Tx Value</span>
        </v-col>
        <v-col sm="2"> Timestamp </v-col>
        <v-col :sm="props.tab === routes[0] ? 1 : 2"> To/From </v-col>
        <v-col sm="2"> Address </v-col>
        <v-col sm="2"> Hash </v-col>
        <template v-if="props.tab === routes[0]">
            <v-col sm="2"> Balance Change </v-col>
            <v-col sm="1"> Details </v-col>
        </template>
        <template v-else>
            <v-col sm="2">Estimated Fee</v-col>
        </template>
    </v-row>
    <v-divider class="my-0 mt-md-4 mx-n4 mx-sm-n6" />
</template>

<script setup lang="ts">
import { Q_ADDRESS_TRANSFERS } from '@/core/router/routesNames'

const routes = Q_ADDRESS_TRANSFERS

const props = defineProps({
    tab: {
        type: String,
        required: true
    }
})
</script>
