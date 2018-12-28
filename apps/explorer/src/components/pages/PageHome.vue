<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs />
    <v-layout row wrap justify-space-between mb-4>
      <v-flex xs12 sm6 md3> <app-info-card :title="$t('smlBlock.last')" :value="latestBlockNumber" colorType="primary" backType="last-block" /> </v-flex>
      <v-flex xs12 sm6 md3>
        <app-info-card :title="$t('smlBlock.time')" :value="secSinceLastBlock" colorType="success" backType="time-since" metrics="sec" />
      </v-flex>
      <v-flex xs12 sm6 md3>
        <app-info-card :title="$t('smlBlock.hashR')" :value="latestHashRate" colorType="warning" backType="hash-rate" metrics="Th/s" />
      </v-flex>
      <v-flex xs12 sm6 md3>
        <app-info-card :title="$t('smlBlock.diff')" :value="latestDifficulty" colorType="error" backType="difficulty" metrics="Th" />
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
      <v-flex xs12> <table-blocks v-if="blocks" :maxBlocks="true" :blocks="blocks" showStyle="max-height: 590px" /> </v-flex>
    </v-layout>
    <!-- End Last Blocks -->
    <!-- Last Txs -->
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12> <table-transactions v-if="txs" :transactions="txs" showStyle="max-height: 590px" /> </v-flex>
    </v-layout>
    <!-- End Last Txs -->
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide, Mixins } from 'vue-property-decorator'
import Visibility from 'visibilityjs'
import { Events } from 'ethvm-common'
import BN from 'bignumber.js'
import AppBreadCrumbs from '@app/components/ui/AppBreadCrumbs.vue'
import AppInfoCard from '@app/components/ui/AppInfoCard.vue'
import ChartLiveTx from '@app/components/charts/live/ChartLiveTx.vue'
import ChartLiveTxFees from '@app/components/charts/live/ChartLiveTxFees.vue'
import TableBlocks from '@app/components/tables/TableBlocks.vue'
import TableTransactions from '@app/components/tables/TableTransactions.vue'
import { lastBlockInfo } from '@app/components/mixins/mixin-last-block-stats'
import { Events as sEvents } from 'ethvm-common'
import { Block, Tx, PendingTx } from '@app/models'

const MAX_ITEMS = 20
@Component({
  components: {
    AppBreadCrumbs,
    TableBlocks,
    TableTransactions,
    AppInfoCard,
    ChartLiveTx,
    ChartLiveTxFees
  }
})
export default class FramesHome extends Mixins(lastBlockInfo) {
  @Provide() blocks = []
  data() {
    return {
      blocks: null
    }
  }

  created() {
    this.blocks = this.$store.getters.getBlocks
    this.$eventHub.$on(Events.newBlock, _block => {
      if (Visibility.state() === 'visible') {
        this.blocks = this.$store.getters.getBlocks.slice(0, MAX_ITEMS)
      }
    })
  }

  beforeDestroy() {
    this.$eventHub.$off(Events.newBlock)
  }
  get txs() {
    if (this.$store.getters.getTxs.length) {
      return this.$store.getters.getTxs.slice(0, MAX_ITEMS)
    }
    return []
  }
}
</script>
