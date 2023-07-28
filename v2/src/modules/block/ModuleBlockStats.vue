<template>
    <v-container fluid class="pa-0">
        <v-row :class="[rowMargin, 'fill-height my-n1 my-sm-n3']" align-content="center" justify="center">
            <v-col cols="12" sm="6" md="3" :class="[columnPadding, 'pb-sm-2 pb-md-3']">
                <BlockStatsCard
                    :is-loading="loading"
                    :title="$t('stats.lastBlock')"
                    :value="blockNumber.toString()"
                    :img="require('@/assets/block-stats-icons/block.svg')"
                />
            </v-col>
            <v-col cols="12" sm="6" md="3" :class="[columnPadding, 'pb-sm-2 pb-md-3']">
                <BlockStatsCard
                    :title="$t('stats.lastUpdate')"
                    :value="timestamp"
                    is-date
                    :is-loading="loading"
                    metrics="sec"
                    color-type="success"
                    back-type="time-since"
                    :img="require('@/assets/block-stats-icons/time.svg')"
                />
            </v-col>
            <v-col cols="12" sm="6" md="3" :class="[columnPadding, 'pt-sm-1 pt-md-3']">
                <BlockStatsCard
                    :title="$t('common.gasPrice')"
                    :value="gasPrice"
                    mertrics="Gwei"
                    :is-loading="loading"
                    :img="require('@/assets/block-stats-icons/gas.svg')"
                />
            </v-col>
            <v-col cols="12" sm="6" md="3" :class="[columnPadding, 'pt-sm-1 pt-md-3']">
                <BlockStatsCard
                    :title="`${currencyName} ${$t('common.price')}`"
                    :value="ethPrice"
                    :is-loading="loadingMarketInfo"
                    :img="require('@/assets/block-stats-icons/eth.svg')"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
//Vue
import { ref, computed } from 'vue'
//Apollo
import { useGetLatestBlockInfoQuery } from './apollo/BlockStats/blockStats.generated'
import { useBlockSubscription } from '@core/composables/NewBlock/newBlock.composable'
// Component imports
import BlockStatsCard from './components/BlockStatsCard.vue'
// Helpers
import { useCoinData } from '@/core/composables/CoinData/coinData.composable'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { formatUsdValue, formatFloatingPointValue } from '@core/helper/number-format-helper'
import BN from 'bignumber.js'
import Web3Utils from 'web3-utils'
import { useNetwork } from '@/core/composables/Network/useNetwork'

const { currencyName } = useNetwork()
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
    return '$0.00'
})

const gasPrice = computed<string>(() => {
    if (blockInfo.value && blockInfo.value?.getLatestBlockInfo.baseFeePerGas) {
        const gwei = Web3Utils.fromWei(blockInfo.value.getLatestBlockInfo.baseFeePerGas, 'Gwei')
        return formatFloatingPointValue(new BN(gwei)).value
    }
    return '0'
})

onNewBlockLoaded(res => {
    const number = res.data?.newBlockFeed.number
    if (number && number !== blockNumber.value) {
        timestamp.value = new Date().toString()
        refetch()
    }
})
</script>
