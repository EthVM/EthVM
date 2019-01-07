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
      <v-flex xs12> <table-blocks v-if="blocks" :max-blocks="true" :blocks="blocks" show-style="max-height: 590px" /> </v-flex>
    </v-layout>
    <!-- End Last Blocks -->
    <!-- Last Txs -->
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12> <table-txs v-if="txs" :transactions="txs" show-style="max-height: 590px" /> </v-flex>
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
import TableTxs from '@app/components/tables/TableTxs.vue'
import { LastBlockInfoMixin } from '@app/components/mixins'
import { Block } from '@app/models'

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
  blocks: Block[]

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
