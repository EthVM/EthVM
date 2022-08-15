<template>
    <v-container fluid class="pa-0">
        <v-row class="fill-height" align-content="center" justify="center">
            <v-col cols="12" sm="6" md="3">
                <BlockStatsCard :is-loading="loading" title="Last Block #" :value="blockNumber" color-type="primary" back-type="last-block" />
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <BlockStatsCard
                    title="Since last update"
                    :value="timestamp"
                    :is-date="!loading"
                    :is-loading="loading"
                    metrics="sec"
                    color-type="success"
                    back-type="time-since"
                />
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <BlockStatsCard title="Hash Rate" :value="latestHashRate" :is-loading="loading" metrics="Th/s" color-type="warning" back-type="hash-rate" />
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <BlockStatsCard title="Difficulty" :value="latestDifficulty" :is-loading="loading" color-type="error" back-type="difficulty" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
//Vue
import { ref, computed } from 'vue'
//Apollo
import { BlockInfoFragment, useGetLatestBlockInfoQuery } from './apollo/BlockStats/blockStats.generated'
import { useBlockSubscription } from '@core/composables/NewBlock/newBlock.composable'

import BN from 'bignumber.js'

// Component imports
import BlockStatsCard from './components/BlockStatsCard.vue'

const { result: blockInfo, loading, refetch } = useGetLatestBlockInfoQuery()
const { onNewBlockLoaded } = useBlockSubscription()

const blockNumber = computed<number | string>(() => {
    if (blockInfo.value) {
        return new BN(blockInfo.value?.getLatestBlockInfo.number).toFormat()
    }
    return 0
})

const latestBlockInfo = computed<BlockInfoFragment | undefined>(() => {
    return blockInfo.value?.getLatestBlockInfo
})

const timestamp = ref(new Date().toString())

// Computed properties
const latestHashRate = computed<string>(() => {
    if (latestBlockInfo.value) {
        return new BN(latestBlockInfo.value.hashRate).div('1e12').decimalPlaces(2).toFormat()
    }
    return ''
})

const latestDifficulty = computed<string>(() => {
    if (latestBlockInfo.value) {
        return new BN(latestBlockInfo.value.difficulty).div('1e12').decimalPlaces(2).toFormat()
    }
    return ''
})

onNewBlockLoaded(res => {
    const number = res.data?.newBlockFeed.number
    if (number && number !== blockNumber.value) {
        timestamp.value = new Date().toString()
        refetch()
    }
})
</script>
