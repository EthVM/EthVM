<template>
    <v-container fluid class="pa-0">
        <v-row :class="[rowMargin, 'fill-height']" align-content="center" justify="center">
            <v-col cols="12" sm="6" md="3" :class="columnPadding">
                <BlockStatsCard :is-loading="loading" title="Last Block" :value="blockNumber.toString()" />
            </v-col>
            <v-col cols="12" sm="6" md="3" :class="columnPadding">
                <BlockStatsCard
                    title="Last update"
                    :value="timestamp"
                    is-date
                    :is-loading="loading"
                    metrics="sec"
                    color-type="success"
                    back-type="time-since"
                />
            </v-col>
            <v-col cols="12" sm="6" md="3" :class="columnPadding">
                <BlockStatsCard title="Gas Price" value="24" mertrics="Gwei" :is-loading="loading" />
            </v-col>
            <v-col cols="12" sm="6" md="3" :class="columnPadding">
                <BlockStatsCard title="Eth Price" :value="ethPrice" :is-loading="loadingMarketInfo" />
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
// Component imports
import BlockStatsCard from './components/BlockStatsCard.vue'
// Helpers
import { useCoinData } from '@/core/composables/CoinData/coinData.composable'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { formatUsdValue } from '@core/helper/number-format-helper'
import BN from 'bignumber.js'

const { result: blockInfo, loading, refetch } = useGetLatestBlockInfoQuery()
const { onNewBlockLoaded } = useBlockSubscription()
const { columnPadding, rowMargin } = useAppViewGrid()

const { loading: loadingMarketInfo, ethMarketInfo } = useCoinData()
const blockNumber = computed<number | string>(() => {
    if (blockInfo.value) {
        return new BN(blockInfo.value?.getLatestBlockInfo.number).toFormat()
    }
    return 0
})

const timestamp = ref(new Date().toString())

// Computed properties
const ethPrice = computed<string>(() => {
    if (ethMarketInfo.value) {
        return formatUsdValue(new BN(ethMarketInfo.value.current_price || 0)).value
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
