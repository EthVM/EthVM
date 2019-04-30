<template>
  <v-layout row wrap justify-space-between mb-4>
    <v-flex xs12 sm6 md3> <app-info-card :title="$t('block.last-n')" :value="latestBlockNumber" color-type="primary" back-type="last-block" /> </v-flex>
    <v-flex xs12 sm6 md3>
      <app-info-card
        v-if="type === 'generic'"
        :title="$t('block.time')"
        :value="secSinceLastBlock"
        color-type="success"
        back-type="time-since"
        :metrics="$t('message.sec')"
      />
      <app-info-card v-else :title="$tc('tx.success', 2)" :value="latestBlockSuccessTxs" color-type="txSuccess" back-type="success-txs" />
    </v-flex>
    <v-flex xs12 sm6 md3>
      <app-info-card
        v-if="type === 'generic'"
        :title="$t('block.hash-rate')"
        :value="latestHashRate"
        color-type="warning"
        back-type="hash-rate"
        metrics="Th/s"
      />
      <app-info-card v-else :title="$tc('tx.failed', 2)" :value="latestBlockFailedTxs" color-type="error" back-type="failed-txs" />
    </v-flex>
    <v-flex xs12 sm6 md3>
      <app-info-card v-if="type === 'generic'" :title="$t('diff.name')" :value="latestDifficulty" color-type="error" back-type="difficulty" metrics="Th" />
      <app-info-card v-else :title="$tc('tx.pending-short', 2)" :value="latestBlockPendingTxs" color-type="success" back-type="time-since" />
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import AppInfoCard from '@app/core/components/ui/AppInfoCard.vue'
import { Events } from '@app/core/hub'
import { Block, BlockMetrics } from '@app/core/models'
import { latestBlockStats } from '@app/core/components/ui/stats.graphql'
import BN from 'bignumber.js'
import { Component, Prop, Vue } from 'vue-property-decorator'
import BigNumber from 'bignumber.js';

class Stats {

  lastNumber?: BigNumber
  lastTimestamp?: number
  lastDifficulty?: BigNumber
  hashRate?: BigNumber
  lastNumSuccessfulTxs?: BigNumber
  lastNumFailedTxs?: BigNumber

  constructor(
    lastNumber?: string,
    lastTimestamp?: string,
    lastDifficulty?: string,
    hashRate?: string,
    lastNumSuccessfulTxs?: string,
    lastNumFailedTxs?: string
  ) {
    if(lastNumber) this.lastNumber = new BigNumber(lastNumber, 16)
    if(lastTimestamp) this.lastTimestamp = +lastTimestamp
    if(lastDifficulty) this.lastDifficulty = new BigNumber(lastDifficulty, 16)
    if(hashRate) this.hashRate = new BigNumber(hashRate, 16)
    if(lastNumSuccessfulTxs) this.lastNumSuccessfulTxs = new BigNumber(lastNumSuccessfulTxs, 16)
    if(lastNumFailedTxs) this.lastNumFailedTxs = new BigNumber(lastNumFailedTxs, 16)
  }

}


@Component({
  components: {
    AppInfoCard
  },
  apollo: {

    stats: {

      query() {
        return latestBlockStats
      },

      update({ blockSummaries, hashRate }) {
        const { number, timestamp, difficulty, numSuccessfulTxs, numFailedTxs } = blockSummaries.items[0]
        return new Stats(number, timestamp, difficulty, hashRate, numSuccessfulTxs, numFailedTxs)
      },

      // subscribeToMore: {
      //
      //   document: newBlock,
      //
      //   updateQuery: (previousResult, {subscriptionData}) => {
      //
      //     const {blockSummaries} = previousResult
      //     const {newBlock} = subscriptionData.data
      //
      //     const items = Object.assign([], blockSummaries.items)
      //     items.unshift(new BlockSummaryExt(newBlock))
      //
      //     // ensure order by block number desc
      //     items.sort((a, b) => {
      //       const numberA = a.number ? new BigNumber(a.number, 16) : new BigNumber(0)
      //       const numberB = b.number ? new BigNumber(b.number, 16) : new BigNumber(0)
      //       return numberB.minus(numberA).toNumber()
      //     })
      //
      //     return {
      //       ...previousResult,
      //       blockSummaries: {
      //         ...blockSummaries,
      //         items,
      //       }
      //     }
      //   },
      //
      //   skip() {
      //     return this.pageType !== 'home'
      //   }
      // }
    }
  }
})
export default class AppInfoCardGroup extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop({ type: String, default: 'generic' }) type!: string

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  stats: Stats = new Stats()
  blockMetric: BlockMetrics | null = null
  seconds: number = 0
  secondsInterval: number | null = null

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  created() {
    this.startCount()
  }

  mounted() {
    this.$eventHub.$on(Events.NEW_BLOCK_METRIC, _ => {
      const lastBlockMetric = this.$store.getters.blockMetrics.top()
      if (lastBlockMetric) {
        this.setBlockMetric(lastBlockMetric)
        this.startCount()
      }
    })
  }

  beforeDestroy() {
    if (this.secondsInterval) {
      clearInterval(this.secondsInterval)
    }
    this.$eventHub.$off([Events.NEW_BLOCK_METRIC])
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  startCount(): void {
    this.secondsInterval = window.setInterval(() => {
      if (this.stats) {
        this.seconds = Math.ceil((new Date().getTime() - this.stats.lastTimestamp! * 1000) / 1000)
      }
    }, 1000)
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get loading(): boolean {
    return this.$apollo.queries.stats.loading
  }

  get currentType(): string {
    return this.type
  }

  get loadingMessage(): string {
    return this.$i18n.t('message.load').toString()
  }

  get latestBlockNumber(): string {
    return !this.loading ? this.stats.lastNumber!.toString() : this.loadingMessage
  }

  get latestHashRate(): string {
    return !this.loading ? this.stats.hashRate!.div('1e12').decimalPlaces(4).toString() : this.loadingMessage
  }

  get latestDifficulty(): string {
    return !this.loading ? this.stats.lastDifficulty!.div('1e12').decimalPlaces(4).toString() : this.loadingMessage
  }

  get latestBlockSuccessTxs(): string {
    return !this.loading ? this.stats.lastNumSuccessfulTxs!.toString() : this.loadingMessage
  }

  get latestBlockFailedTxs(): string {
    return !this.loading ? this.stats.lastNumFailedTxs!.toString() : this.loadingMessage
  }

  get latestBlockPendingTxs(): string {
    return !this.loading && this.blockMetric ? this.blockMetric.numPendingTxs.toString() : this.loadingMessage
  }

  get secSinceLastBlock(): string {
    return !this.loading ? this.seconds.toString() : this.loadingMessage
  }
}
</script>
