<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs />
    <v-layout row wrap justify-space-between mb-4>
      <v-flex xs12 sm6 md3> <app-info-card :title="$t('smlBlock.last')" :value="latestBlockNumber" color-type="primary" back-type="last-block" /> </v-flex>
      <v-flex xs12 sm6 md3>
        <app-info-card :title="$t('smlBlock.time')" :value="secSinceLastBlock" color-type="success" back-type="time-since" metrics="sec" />
      </v-flex>
      <v-flex xs12 sm6 md3>
        <app-info-card :title="$t('smlBlock.hashR')" :value="latestHashRate" color-type="warning" back-type="hash-rate" metrics="Th/s" />
      </v-flex>
      <v-flex xs12 sm6 md3>
        <app-info-card :title="$t('smlBlock.diff')" :value="latestDifficulty" color-type="error" back-type="difficulty" metrics="Th" />
      </v-flex>
    </v-layout>
    <!-- Charts -->
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12 md6> <chart-live-tx /> </v-flex>
      <v-flex xs12 md6> <chart-live-tx-fees /> </v-flex>
    </v-layout>
    <!-- End Charts -->
    <!-- Last Blocks -->
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12> <table-blocks :max-blocks="true" :blocks="blocks" :loading="blocksLoading" :show-style="tableStyle" page-type="home" /> </v-flex>
    </v-layout>
    <!-- End Last Blocks -->
    <!-- Last Txs -->
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12> <table-txs :transactions="txs" :loading="txsLoading" :show-style="tableStyle" page-type="home" /> </v-flex>
    </v-layout>
    <!-- End Last Txs -->
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator'
import { Events } from 'ethvm-common'
import AppBreadCrumbs from '@app/components/ui/AppBreadCrumbs.vue'
import AppInfoCard from '@app/components/ui/AppInfoCard.vue'
import ChartLiveTx from '@app/components/charts/live/ChartLiveTx.vue'
import ChartLiveTxFees from '@app/components/charts/live/ChartLiveTxFees.vue'
import TableBlocks from '@app/components/tables/TableBlocks.vue'
import TableTxs from '@app/components/tables/TableTxs.vue'
import { LastBlockInfoMixin } from '@app/components/mixins'
import { Block, Tx } from '@app/models'

const MAX_ITEMS = 20

@Component({
  components: {
    AppBreadCrumbs,
    TableBlocks,
    TableTxs,
    AppInfoCard,
    ChartLiveTx,
    ChartLiveTxFees
  }
})
export default class PageHome extends Mixins(LastBlockInfoMixin) {
  tableStyle = 'max-height: 590px'

  // Lifecycle
  created() {
    this.$socket.emit(
      Events.pastBlocks,
      {
        limit: 20,
        page: 0
      },
      (err, blocks) => {
        this.$store.commit(Events.newBlock, blocks)
        if (blocks && blocks.length > 0) {
          this.$eventHub.$emit(Events.pastBlocksR)
          this.$eventHub.$emit(Events.newBlock, new Block(blocks[0]))
        }
      }
    )

    this.$socket.emit(

      Events.pastTxs,
      {
        limit: 20,
        page: 0
      },
      (err, txs) => {
        this.$store.commit(Events.newTx, txs)
        if (txs && txs.length > 0) {
          this.$eventHub.$emit(Events.pastTxsR)
          this.$eventHub.$emit(Events.newTx, new Tx(txs[0]))
        }
      }
    )
  }


  /* Computed: */
  get txs(): Tx[] {
    return this.$store.getters.getTxs.slice(0, MAX_ITEMS)
  }

  get blocks(): Block[] {
    return this.$store.getters.getBlocks.slice(0, MAX_ITEMS)
  }

  get blocksLoading(): boolean {
    return this.blocks.length === 0
  }

  get txsLoading(): boolean {
    return this.txs.length === 0
  }
}
</script>
