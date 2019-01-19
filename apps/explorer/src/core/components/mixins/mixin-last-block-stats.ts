import { Events } from 'ethvm-common'
import { Block } from '@app/core/models'
import BN from 'bignumber.js'
import { Component, Vue } from 'vue-property-decorator'

@Component
export class LastBlockInfoMixin extends Vue {
  data() {
    return {
      block: null,
      seconds: 0,
      secondsInterval: null,
      isLoaded: false,
      loadingMessage: this.$i18n.t('message.load')
    }
  }

  // Lifecycle
  created() {
    const lastBlock = this.$store.getters.blocks[0]
    if (lastBlock) {
      this.setBlock(lastBlock)
      this.startCount()
    }
  }

  mounted() {
    this.$eventHub.$on(Events.newBlock, _block => {
      const lastBlock = this.$store.getters.blocks[0]
      if (lastBlock) {
        this.setBlock(lastBlock)
        this.startCount()
      }
    })
  }

  beforeDestroy() {
    clearInterval(this.secondsInterval)
    this.$eventHub.$off([Events.newBlock])
  }

  // Computed
  get latestBlockNumber(): string {
    return this.isLoaded ? this.block.getNumber().toString() : this.loadingMessage
  }

  get latestHashRate(): string {
    return this.isLoaded ? this.getRoundNumber(this.getAvgHashRate(this.$store.getters.blocks).toString()).toString() : this.loadingMessage
  }

  get latestDifficulty(): string {
    if (this.isLoaded) {
      const difficulty = this.block.getDifficulty()
      const ths = this.getTHs(difficulty)
      return this.getRoundNumber(ths).toString()
    }
    return this.loadingMessage
  }

  get latestBlockSuccessTxs(): string {
    return this.isLoaded ? this.block.getStats().successfulTxs.toString() : this.loadingMessage
  }

  get latestBlockFailedTxs(): string {
    return this.isLoaded ? this.block.getStats().failedTxs.toString() : this.loadingMessage
  }

  get latestBlockPendingTxs(): string {
    return this.isLoaded ? this.block.getStats().pendingTxs.toString() : this.loadingMessage
  }

  get secSinceLastBlock(): string {
    return this.seconds.toString()
  }

  // Methods
  setBlock(block: Block) {
    this.isLoaded = true
    this.block = block
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

  getRoundNumber(number, round: number = 2) {
    if (!round) {
      round = 2
    }
    const n = new BN(number)
    return n.decimalPlaces(round).toString()
  }

  getShortValue(value: string = '', isBool: any) {
    const length = value.length
    let isShort = false
    if (length > 8) {
      value = value.slice(0, 8) + '...'
      isShort = true
    }
    if (!isBool) {
      return value
    }
    return isShort
  }
}
