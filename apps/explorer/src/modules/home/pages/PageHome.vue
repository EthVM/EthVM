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
      <v-flex xs12> <table-blocks :max-blocks="true" :blocks="blocks" :loading="blocksLoading" :show-style="tableStyle" page-type="home" /> </v-flex>
    </v-layout>
    <!-- Last Txs -->
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12> <table-txs :transactions="txs" :loading="txsLoading" :show-style="tableStyle" page-type="home" /> </v-flex>
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

  // Lifecycle
  created() {
    this.$api.getBlocks(MAX_ITEMS, 0).then(blocks => {
      this.$store.commit(Events.NEW_BLOCK, blocks)
      if (blocks && blocks.length > 0) {
        this.$eventHub.$emit(Events.pastBlocksR)
        this.$eventHub.$emit(Events.NEW_BLOCK, blocks[0])
      }
    })

    this.$api.getTxs(MAX_ITEMS, 0).then(txs => {
      this.$store.commit(Events.NEW_TX, txs)
      if (txs && txs.length > 0) {
        this.$eventHub.$emit(Events.pastTxsR)
        this.$eventHub.$emit(Events.NEW_TX, txs[0])
      }
    })
  }

  /* Computed: */
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
}
</script>
