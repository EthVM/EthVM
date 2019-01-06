import { Events as sEvents } from 'ethvm-common'
import { Block } from '@app/models'
import bn from 'bignumber.js'
import Vue from 'vue'

export class LastBlockInfoMixin extends Vue {
  data() {
    return {
      block: null,
      seconds: 0,
      secondsInterval: null,
      dataRecieved: false,
      loading: this.$i18n.t('message.load')
    }
  }

  created() {
    const lastBlock = this.$store.getters.getBlocks[0]
    if (lastBlock) {
      this.setBlock(this.$store.getters.getBlocks[0])
      this.startCount()
    }
  }

  mounted() {
    this.$eventHub.$on(sEvents.newBlock, _block => {
      this.setBlock(this.$store.getters.getBlocks[0])
      this.startCount()
    })
  }

  beforeDestroy() {
    clearInterval(this.secondsInterval)
    this.$eventHub.$off([sEvents.pastBlocksR, sEvents.newBlock])
  }

  // Computed
  get latestBlockNumber(): string {
    return this.dataRecieved ? this.block.getNumber().toString() : this.loading
  }

  get latestHashRate(): string {
    return this.dataRecieved ? this.getRoundNumber(this.getAvgHashRate(this.$store.getters.getBlocks).toString()).toString() : this.loading
  }

  get latestDifficulty(): string {
    return this.dataRecieved ? this.getRoundNumber(this.getTHs(this.block.getDifficulty())).toString() : this.loading
  }

  get latestBlockSuccessTxs(): string {
    return this.dataRecieved ? this.block.getStats().successfulTxs.toString() : this.loading
  }

  get latestBlockFailedTxs(): string {
    return this.dataRecieved ? this.block.getStats().failedTxs.toString() : this.loading
  }

  get latestBlockPendingTxs(): string {
    return this.dataRecieved ? this.block.getStats().pendingTxs.toString() : this.loading
  }

  get secSinceLastBlock(): string {
    return this.seconds.toString()
  }

  // Methods
  setBlock(newBlock: Block) {
    this.dataRecieved = true
    this.block = newBlock
  }

  getAvgHashRate(blocks: Block[]) {
    let avg = new bn(0)
    if (!blocks || blocks.length == 0) {
      return avg.toNumber()
    }
    blocks.forEach(block => {
      const stats = block.getStats()
      const blockTime = stats.processingTimeMs
      avg = avg.plus(new bn(blockTime))
    })
    avg = avg.dividedBy(blocks.length)
    if (avg.isZero) {
      return avg.toNumber()
    }
    const difficulty = blocks[0].getDifficulty()
    return new bn(difficulty)
      .dividedBy(avg)
      .dividedBy('1e12')
      .toNumber()
  }

  getTHs(_num: string) {
    return new bn(_num).dividedBy('1e12').toNumber()
  }

  startCount() {
    this.secondsInterval = setInterval(() => {
      this.seconds = Math.ceil((new Date().getTime() - this.block.getTimestamp()) / 1000)
    }, 1000)
  }

  getRoundNumber(newNumber, round) {
    if (!round) {
      round = 2
    }
    const n = new bn(newNumber)
    return n.decimalPlaces(round).toString()
  }

  getShortValue(newValue, isBool) {
    const length = newValue.length
    let isShort = false
    if (length > 8) {
      newValue = newValue.slice(0, 8) + '...'
      isShort = true
    }
    if (!isBool) {
      return newValue
    }
    return isShort
  }
}
