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
import BN from 'bignumber.js'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: {
    AppInfoCard
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

  loading: boolean = true
  blockMetric: BlockMetrics | null = null
  seconds: number = 0
  secondsInterval: number | null = null

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  created() {
    const lastBlockMetric = this.$store.getters.blockMetrics.top()
    if (lastBlockMetric) {
      this.setBlockMetric(lastBlockMetric)
      this.startCount()
    }
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

  setBlockMetric(bm: BlockMetrics): void {
    this.blockMetric = bm
    this.loading = false
  }

  getAvgHashRate(bms: BlockMetrics[] = []): string {
    if (!bms || bms.length === 0) {
      return new BN(0).toString()
    }

    const avg = bms
      .map(bm => new BN(bm.blockTime))
      .reduceRight((acc, v) => acc.plus(v), new BN(0))
      .dividedBy(bms.length)
      .dividedBy(1000)

    if (avg.isZero) {
      return avg.toString()
    }

    const { difficulty } = bms[0]
    return new BN(difficulty)
      .dividedBy('1e12')
      .dividedBy(avg)
      .decimalPlaces(4)
      .toString()
  }

  startCount(): void {
    this.secondsInterval = window.setInterval(() => {
      if (this.blockMetric) {
        this.seconds = Math.ceil((new Date().getTime() - this.blockMetric.timestamp * 1000) / 1000)
      }
    }, 1000)
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get currentType(): string {
    return this.type
  }

  get loadingMessage(): string {
    return this.$i18n.t('message.load').toString()
  }

  get latestBlockNumber(): string {
    return !this.loading && this.blockMetric ? this.blockMetric.number.toString() : this.loadingMessage
  }

  get latestHashRate(): string {
    return !this.loading ? this.getAvgHashRate(this.$store.getters.blockMetrics.items()) : this.loadingMessage
  }

  get latestDifficulty(): string {
    if (!this.loading && this.blockMetric) {
      const { difficulty } = this.blockMetric
      return new BN(difficulty)
        .dividedBy('1e12')
        .decimalPlaces(4)
        .toString()
    }
    return this.loadingMessage
  }

  get latestBlockSuccessTxs(): string {
    return !this.loading && this.blockMetric ? this.blockMetric.numSuccessfulTxs.toString() : this.loadingMessage
  }

  get latestBlockFailedTxs(): string {
    return !this.loading && this.blockMetric ? this.blockMetric.numFailedTxs.toString() : this.loadingMessage
  }

  get latestBlockPendingTxs(): string {
    return !this.loading && this.blockMetric ? this.blockMetric.numPendingTxs.toString() : this.loadingMessage
  }

  get secSinceLastBlock(): string {
    return !this.loading ? this.seconds.toString() : this.loadingMessage
  }
}
</script>
