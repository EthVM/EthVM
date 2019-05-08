<template>
  <v-container grid-list-lg class="mb-0">
    <h1>Connected: {{ $wsConnected }}</h1>

    <app-bread-crumbs />
    <!--
    =====================================================================================
      Card Stats
    =====================================================================================
    -->
    <app-card-stats-group />
    <!--
    =====================================================================================
      Live Charts
    =====================================================================================
    -->
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12 md6> <chart-live-txs /> </v-flex>
      <v-flex xs12 md6> <chart-live-tx-fees /> </v-flex>
    </v-layout>
    <!--
    =====================================================================================
      Latest Blocks
    =====================================================================================
    -->
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12>
        <table-blocks :max-blocks="true" :show-style="tableStyle" :max-items="maxItems" page-type="home" />
      </v-flex>
    </v-layout>
    <!--
    =====================================================================================
      Latest Txs
    =====================================================================================
    -->
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12>
        <table-txs :show-style="tableStyle" page-type="home" :max-items="maxItems" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppCardStatsGroup from '@app/core/components/ui/AppCardStatsGroup.vue'
import ChartLiveTxFees from '@app/modules/charts/components/live/ChartLiveTxFees.vue'
import ChartLiveTxs from '@app/modules/charts/components/live/ChartLiveTxs.vue'
import TableBlocks from '@app/modules/blocks/components/TableBlocks.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import { Component, Vue } from 'vue-property-decorator'

const MAX_ITEMS = 50

@Component({
  components: {
    AppBreadCrumbs,
    AppCardStatsGroup,
    ChartLiveTxFees,
    ChartLiveTxs,
    TableBlocks,
    TableTxs
  }
})
export default class PageHome extends Vue {
  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  tableStyle = 'max-height: 450px'
  errorTableTxs = ''
  errorTableBlocks = ''

  get maxItems(): number {
    return MAX_ITEMS
  }
}
</script>
