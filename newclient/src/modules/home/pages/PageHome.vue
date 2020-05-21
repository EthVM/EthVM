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
        <!-- <v-layout row wrap justify-center mb-4 fill-height>
      <v-flex xs12 md6>
        <v-card flat color="white" height="100%">
          <chart-live-txs />
        </v-card>
      </v-flex>
      <v-flex xs12 md6>
        <v-card flat color="white" height="100%">
          <chart-live-tx-fees />
        </v-card>
      </v-flex>
    </v-layout> -->
        <!--
    =====================================================================================
      Latest Blocks
    =====================================================================================
    -->
        <!-- <v-layout row wrap justify-center mb-4>
      <v-flex xs12>
        <table-blocks :max-blocks="true" :show-style="tableStyle" :max-items="maxItems" page-type="home" />
      </v-flex>
    </v-layout> -->
        <!--
    =====================================================================================
      Latest Txs
    -->
        <v-layout row wrap justify-center mb-4>
            <v-flex xs12>
                <home-txs :max-items="maxItems" :new-block="newBlockNumber" />
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import BlockStats from '@app/modules/blocks/handlers/BlockStats/BlockStats.vue'
import { NewBlockSubscription } from '@app/modules/blocks/NewBlockSubscription/newBlockSubscription.mixin'
// import ChartLiveTxFees from '@app/modules/charts/components/live/ChartLiveTxFees.vue'
// import ChartLiveTxs from '@app/modules/charts/components/live/ChartLiveTxs.vue'
// import TableBlocks from '@app/modules/blocks/components/TableBlocks.vue'
import HomeTxs from '@app/modules/txs/handlers/HomeTxs/HomeTxs.vue'
import { Component, Mixins } from 'vue-property-decorator'

const MAX_ITEMS = 50

@Component({
    components: {
        AppBreadCrumbs,
        BlockStats,
        // ChartLiveTxFees,
        // ChartLiveTxs,
        // TableBlocks,
        HomeTxs
    }
})
export default class PageHome extends Mixins(NewBlockSubscription) {
    /*
    ===================================================================================
    Initial Data
    ===================================================================================
    */
    tableStyle = 'max-height: 450px'

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
