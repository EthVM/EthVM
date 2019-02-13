<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs />
    <!-- Info Cards Stats -->
    <app-card-stats-group />
    <!-- Charts -->
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12 md6> <chart-live-tx /> </v-flex>
      <v-flex xs12 md6> <chart-live-tx-fees /> </v-flex>
    </v-layout>
    <!-- Last Blocks -->
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12>
        <table-blocks :max-blocks="true" :blocks="blocks" :loading="blocksLoading" :show-style="tableStyle" page-type="home" />
      </v-flex>
    </v-layout>
    <!-- Last Txs -->
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
import { Block, Tx } from '@app/core/models'
import { Vue, Component, Mixins } from 'vue-property-decorator'

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
  tableStyle = 'max-height: 590px'
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
        this.errorTableTxs = this.$i18n.t('message.error').toString()
      }
    )
  }

  loadBlocks() {
    this.fetchBlocks().then(
      res => {
        this.$store.commit(Events.NEW_BLOCK, res)
      },
      err => {
        this.errorTableBlocks = this.$i18n.t('message.error').toString()
      }
    )
  }

  fetchTxs(): Promise<Tx[]> {
    return this.$api.getTxs(MAX_ITEMS, 0)
  }

  fetchBlocks(): Promise<Block[]> {
    return this.$api.getBlocks(MAX_ITEMS, 0)
  }

  /*
  ===================================================================================
    Computed
  ===================================================================================
  */

  get txs(): Tx[] {
    return this.$store.getters.txs.slice(0, MAX_ITEMS)
  }

  get blocks(): Block[] {
    return this.$store.getters.blocks.slice(0, MAX_ITEMS)
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
