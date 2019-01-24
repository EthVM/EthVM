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
import { Events } from 'ethvm-common'
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

  loading = true
  block = null
  seconds = 0
  secondsInterval = null

  // Lifecycle
  created() {
    const lastBlock = this.$store.getters.blocks[0]
    if (lastBlock) {
      this.setBlock(lastBlock)
      this.startCount()
    }
  }

  mounted() {
    this.$eventHub.$on(Events.NEW_BLOCK, _block => {
      const lastBlock = this.$store.getters.blocks[0]
      if (lastBlock) {
        this.setBlock(lastBlock)
        this.startCount()
      }
    })
  }

  beforeDestroy() {
    clearInterval(this.secondsInterval)
    this.$eventHub.$off([Events.NEW_BLOCK])
  }

  // Lifecycle
  setBlock(block: Block) {
    this.block = block
    this.loading = false
  }

  getAvgHashRate(blocks: Block[] = []) {
    let avg = new BN(0)
    if (!blocks || blocks.length == 0) {
      return avg.toNumber()
    }

    blocks.forEach(block => {
      const stats = block.getStats()
      const blockTime = stats.processingTimeMs
      avg = avg.plus(new BN(blockTime))
    })

    avg = avg.dividedBy(blocks.length)
    if (avg.isZero) {
      return avg.toNumber()
    }

    const difficulty = blocks[0].getDifficulty().toNumber()
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
      this.seconds = Math.ceil((new Date().getTime() - this.block.getTimestamp()) / 1000)
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
    return !this.loading ? this.block.getNumber().toString() : this.loadingMessage
  }

  get latestHashRate(): string {
    return !this.loading ? this.getRoundNumber(this.getAvgHashRate(this.$store.getters.blocks).toString()).toString() : this.loadingMessage
  }

  get latestDifficulty(): string {
    if (!this.loading) {
      const difficulty = this.block.getDifficulty()
      const ths = this.getTHs(difficulty)
      return this.getRoundNumber(ths).toString()
    }
    return this.loadingMessage
  }

  get latestBlockSuccessTxs(): string {
    return !this.loading ? this.block.getStats().successfulTxs.toString() : this.loadingMessage
  }

  get latestBlockFailedTxs(): string {
    return !this.loading ? this.block.getStats().failedTxs.toString() : this.loadingMessage
  }

  get latestBlockPendingTxs(): string {
    return !this.loading ? this.block.getStats().pendingTxs.toString() : this.loadingMessage
  }

  get secSinceLastBlock(): string {
    return !this.loading ? this.seconds.toString() : this.loadingMessage
  }
}
</script>
