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
import { Events } from '@app/core/hub'
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppCardStatsGroup from '@app/core/components/ui/AppCardStatsGroup.vue'
import ChartLiveTxFees from '@app/modules/charts/components/live/ChartLiveTxFees.vue'
import ChartLiveTxs from '@app/modules/charts/components/live/ChartLiveTxs.vue'
import TableBlocks from '@app/modules/blocks/components/TableBlocks.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import { SimpleBlock, SimpleTx, Tx } from '@app/core/models'
import { Subscription } from 'apollo-client/util/Observable'
import { Component, Vue } from 'vue-property-decorator'

const MAX_ITEMS = 50

export type NewBlockQuery = {
  data: {
    newBlock: any
  }
}

export type NewBlockMetricQuery = {
  data: {
    newBlockMetric: any
  }
}

export type NewTxsQuery = {
  data: {
    newTxs: any[]
  }
}

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

  /* Subscriptions */
  newSimpleBlockSubscription!: Subscription
  newBlockMetricSubscription!: Subscription
  newSimpleTxsSubscription!: Subscription

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  created() {
    this.loadData()
    this.createSubscriptions()
  }

  beforeDestroy() {
    this.destroySubscriptions()
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  loadData() {
    this.loadBlocks()
    this.loadTxs()
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

  createSubscriptions() {
    const { $store, $eventHub } = this

    // Create blocks subscription
    this.newSimpleBlockSubscription = this.$api.observable<NewBlockQuery>('simpleBlocks').subscribe({
      next(data) {
        const newSimpleBlock = new SimpleBlock(data.data.newBlock)
        $store.commit(Events.NEW_SIMPLE_BLOCK, newSimpleBlock)
        $eventHub.$emit(Events.NEW_SIMPLE_BLOCK, newSimpleBlock)
      },
      error(error): void {
        // console.error(error)
      }
    })

    // Create block metrics subscription
    this.newBlockMetricSubscription = this.$api.observable<NewBlockMetricQuery>('blockMetrics').subscribe({
      next(data) {
        const { newBlockMetric } = data.data
        $store.commit(Events.NEW_BLOCK_METRIC, newBlockMetric)
        $eventHub.$emit(Events.NEW_BLOCK_METRIC, newBlockMetric)
      },
      error(error): void {
        // console.error(error)
      }
    })

    // Create txs subscription
    this.newSimpleTxsSubscription = this.$api.observable<NewTxsQuery>('simpleTxs').subscribe({
      next(data) {
        const { newTxs } = data.data
        $store.commit(Events.NEW_TX, newTxs)
        $eventHub.$emit(Events.NEW_TX, newTxs)
      },
      error(error): void {
        // console.error(error)
      }
    })
  }

  destroySubscriptions() {
    this.newSimpleBlockSubscription.unsubscribe()
    this.newBlockMetricSubscription.unsubscribe()
    this.newSimpleTxsSubscription.unsubscribe()
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
