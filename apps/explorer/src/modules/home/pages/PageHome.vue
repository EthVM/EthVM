<template>
  <v-container grid-list-lg class="mb-0">
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
      <v-flex xs12 md6> <chart-live-tx /> </v-flex>
      <v-flex xs12 md6> <chart-live-tx-fees /> </v-flex>
    </v-layout>
    <!--
    =====================================================================================
      Latest Blocks
    =====================================================================================
    -->
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12>
        <table-blocks :max-blocks="true" :blocks="blocks" :loading="blocksLoading" :show-style="tableStyle" :error="errorTableBlocks" page-type="home" />
      </v-flex>
    </v-layout>
    <!--
    =====================================================================================
      Latest Txs
    =====================================================================================
    -->
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12>
        <table-txs :transactions="txs" :loading="txsLoading" :show-style="tableStyle" page-type="home" :error="errorTableTxs" :max-items="maxItems" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Events } from 'ethvm-common'
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppCardStatsGroup from '@app/core/components/ui/AppCardStatsGroup.vue'
import ChartLiveTx from '@app/modules/charts/components/live/ChartLiveTx.vue'
import ChartLiveTxFees from '@app/modules/charts/components/live/ChartLiveTxFees.vue'
import TableBlocks from '@app/modules/blocks/components/TableBlocks.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import { Block, Tx, SimpleBlock, SimpleTx } from '@app/core/models'
import { Vue, Component } from 'vue-property-decorator'

const MAX_ITEMS = 50

@Component({
  components: {
    AppBreadCrumbs,
    AppCardStatsGroup,
    TableBlocks,
    TableTxs,
    ChartLiveTx,
    ChartLiveTxFees
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

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  created() {
    this.loadData()
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  loadData() {
    this.loadTxs()
    this.loadBlocks()
  }

  loadTxs() {
    this.fetchTxs().then(
      res => {
        this.$store.commit(Events.NEW_TX, res)
      },
      err => {
        this.errorTableTxs = this.$i18n.t('message.no-data').toString()
      }
    )
  }

  loadBlocks() {
    this.fetchBlocks().then(
      res => {
        this.$store.commit(Events.NEW_SIMPLE_BLOCK, res)
      },
      err => {
        this.errorTableBlocks = this.$i18n.t('message.no-data').toString()
      }
    )
  }

  fetchTxs(): Promise<SimpleTx[]> {
    return this.$api.getTxs(MAX_ITEMS, 'desc', -1)
  }

  fetchBlocks(): Promise<SimpleBlock[]> {
    return this.$api.getBlocks(MAX_ITEMS, 0, -1)
  }

  /*
  ===================================================================================
    Computed
  ===================================================================================
  */

  get txs(): Tx[] {
    return this.$store.getters.txs.slice(0, MAX_ITEMS)
  }

  get blocks(): SimpleBlock[] {
    return this.$store.getters.simpleBlocks.slice(0, MAX_ITEMS)
  }

  get blocksLoading(): boolean {
    return this.blocks.length === 0
  }

  get txsLoading(): boolean {
    return this.txs.length === 0
  }

  get maxItems(): number {
    return MAX_ITEMS
  }
}
</script>
