<template>
    <v-container grid-list-lg class="mb-0">
        <app-bread-crumbs />
        <!--
    =====================================================================================
      Card Stats
    =====================================================================================
    -->
        <block-stats :new-block="newBlockNumber" />
        <!-- <app-card-stats-group /> -->
        <!--
    =====================================================================================
      Live Charts
    =====================================================================================
    -->
        <v-layout row wrap justify-center mb-4 fill-height>
            <v-flex xs12 md6>
                <v-card flat color="white" height="100%">
                    <home-gas-price-chart />
                </v-card>
            </v-flex>
            <v-flex xs12 md6>
                <v-card flat color="white" height="100%">
                    <!-- <chart
                        key-val="GAS_PRICE_AVG"
                        class="box"
                        :start="5"
                        scale="minutes"
                        label-val="avg gas price"
                        :color="chartColors.green"
                        :transform="toGwei"
                    ></chart> -->
                </v-card>
            </v-flex>
        </v-layout>
        <!--
    =====================================================================================
      Latest Blocks
    =====================================================================================
    -->
        <v-layout row wrap justify-center mb-4>
            <v-flex xs12>
                <recent-blocks :max-items="maxItems" page-type="home" />
            </v-flex>
        </v-layout>
        <!--
    =====================================================================================
      Latest Txs
    -->
        <v-layout row wrap justify-center mb-4>
            <v-flex xs12>
                <home-txs :max-items="maxItems" :new-block="newBlockNumber" page-type="home" />
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import BlockStats from '@app/modules/blocks/handlers/BlockStats/BlockStats.vue'
import { NewBlockSubscription } from '@app/modules/blocks/NewBlockSubscription/newBlockSubscription.mixin'
import HomeGasPriceChart from '@app/modules/charts/handlers/HomeGasPriceChart.vue'
// import ChartLiveTxFees from '@app/modules/charts/components/live/ChartLiveTxFees.vue'
// import ChartLiveTxs from '@app/modules/charts/components/live/ChartLiveTxs.vue'
import RecentBlocks from '@app/modules/blocks/handlers/RecentBlocks/RecentBlocks.vue'
import HomeTxs from '@app/modules/txs/handlers/BlockTxs/BlockTxs.vue'
import { Component, Mixins } from 'vue-property-decorator'
import { fromWei, toBN } from 'web3-utils'
const MAX_ITEMS = 10

@Component({
    components: {
        AppBreadCrumbs,
        BlockStats,
        // ChartLiveTxFees,
        // ChartLiveTxs,
        RecentBlocks,
        HomeTxs,
        HomeGasPriceChart
    }
})
export default class PageHome extends Mixins(NewBlockSubscription) {
    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get maxItems(): number {
        return MAX_ITEMS
    }
}
</script>
