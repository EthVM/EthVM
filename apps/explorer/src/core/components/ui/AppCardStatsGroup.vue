<template>
  <v-layout row wrap justify-space-between mb-4>
    <v-flex xs12 sm6 md3> <app-info-card :title="$t('smlBlock.last')" :value="latestBlockNumber" color-type="primary" back-type="last-block" /> </v-flex>
    <v-flex xs12 sm6 md3>
      <app-info-card
        v-if="type === 'generic'"
        :title="$t('smlBlock.time')"
        :value="secSinceLastBlock"
        color-type="success"
        back-type="time-since"
        metrics="sec"
      />
      <app-info-card v-else :title="$t('smlBlock.success')" :value="latestBlockSuccessTxs" color-type="txSuccess" back-type="success-txs" />
    </v-flex>
    <v-flex xs12 sm6 md3>
      <app-info-card
        v-if="type === 'generic'"
        :title="$t('smlBlock.hashR')"
        :value="latestHashRate"
        color-type="warning"
        back-type="hash-rate"
        metrics="Th/s"
      />
      <app-info-card v-else :title="$t('smlBlock.failed')" :value="latestBlockFailedTxs" color-type="error" back-type="failed-txs" />
    </v-flex>
    <v-flex xs12 sm6 md3>
      <app-info-card v-if="type === 'generic'" :title="$t('smlBlock.diff')" :value="latestDifficulty" color-type="error" back-type="difficulty" metrics="Th" />
      <app-info-card v-else :title="$t('smlBlock.pending')" :value="latestBlockPendingTxs" color-type="success" back-type="time-since" />
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import AppInfoCard from '@app/core/components/ui/AppInfoCard.vue'
import { Events, BlockMetrics } from 'ethvm-common'
import { Block } from '@app/core/models'
import BN from 'bignumber.js'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: {
    AppInfoCard
  }
})
export default class AppInfoCardGroup extends Vue {
  @Prop({ type: String, default: 'generic' }) type!: string

  loading: boolean = true
  blockMetric: BlockMetrics = null
  seconds: number = 0
  secondsInterval = null

  // Lifecycle
  created() {
    const lastBlockMetric = this.$store.getters.blockMetrics[0]
    if (lastBlockMetric) {
      this.setBlockMetric(lastBlockMetric)
      this.startCount()
    }
  }

  mounted() {
    this.$eventHub.$on(Events.NEW_BLOCK_METRIC, _ => {
      const lastBlockMetric = this.$store.getters.blockMetrics[0]
      if (lastBlockMetric) {
        this.setBlockMetric(lastBlockMetric)
        this.startCount()
      }
    })
  }

  beforeDestroy() {
    clearInterval(this.secondsInterval)
    this.$eventHub.$off([Events.NEW_BLOCK_METRIC])
  }

  // Lifecycle
  setBlockMetric(bm: BlockMetrics) {
    this.blockMetric = bm
    this.loading = false
  }

  getAvgHashRate(bms: BlockMetrics[] = []) {
    let avg = new BN(0)
    if (!bms || bms.length === 0) {
      return avg.toNumber()
    }

    bms.forEach(bm => (avg = avg.plus(new BN(bm.blockTime))))

    avg = avg.dividedBy(bms.length)
    if (avg.isZero) {
      return avg.toNumber()
    }

    const difficulty = bms[0].difficulty
    return new BN(difficulty)
      .dividedBy(avg)
      .dividedBy('1e12')
      .toNumber()
  }

  getTHs(num: string): number {
    return new BN(num).dividedBy('1e12').toNumber()
  }

  startCount() {
    this.secondsInterval = setInterval(() => {
      this.seconds = Math.ceil((new Date().getTime() - this.blockMetric.timestamp) / 1000)
    }, 1000)
  }

  getRoundNumber(newNumber, round = 2) {
    return new BN(newNumber).decimalPlaces(round).toString()
  }

  isShortValue(rawStr = ''): boolean {
    return rawStr.length < 10
  }

  getShortValue(rawStr): string {
    return this.isShortValue(rawStr) ? rawStr : rawStr.slice(0, 10) + '...'
  }

  // Computed
  get currentType() {
    return this.type
  }

  get loadingMessage() {
    return this.$i18n.t('message.load').toString()
  }

  get latestBlockNumber(): string {
    return !this.loading ? this.blockMetric.number : this.loadingMessage
  }

  get latestHashRate(): string {
    return !this.loading ? this.getRoundNumber(this.getAvgHashRate(this.$store.getters.blockMetrics).toString()).toString() : this.loadingMessage
  }

  get latestDifficulty(): string {
    if (!this.loading) {
      const difficulty = this.blockMetric.difficulty
      const ths = this.getTHs(difficulty)
      return this.getRoundNumber(ths).toString()
    }
    return this.loadingMessage
  }

  get latestBlockSuccessTxs(): string {
    return !this.loading ? this.blockMetric.numSuccessfulTxs.toString() : this.loadingMessage
  }

  get latestBlockFailedTxs(): string {
    return !this.loading ? this.blockMetric.numFailedTxs.toString() : this.loadingMessage
  }

  get latestBlockPendingTxs(): string {
    return !this.loading ? this.blockMetric.numPendingTxs.toString() : this.loadingMessage
  }

  get secSinceLastBlock(): string {
    return !this.loading ? this.seconds.toString() : this.loadingMessage
  }
}
</script>
