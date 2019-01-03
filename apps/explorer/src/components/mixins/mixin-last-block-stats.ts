import { Events as sEvents } from 'ethvm-common'
import { Block } from '@app/models'
import bn from 'bignumber.js'
import stringConcat from '@app/components/mixins/mixin-number-string-concat'
export const lastBlockInfo = {
  mixins: [stringConcat],
  data() {
    return {
      block: null,
      seconds: 0,
      secondsInterval: null,
      dataRecieved: false,
      loading: this.$i18n.t('message.load')
    }
  },

  computed: {
    latestBlockNumber():string {
      return this.dataRecieved ? this.block.getNumber().toString() : this.loading
    },

    latestHashRate():string {
      return this.dataRecieved ? this.getRoundNumber(this.getAvgHashRate(this.$store.getters.getBlocks).toString()).toString() : this.loading
    },

    latestDifficulty():string {
      return this.dataRecieved ? this.getRoundNumber(this.getTHs(this.block.getDifficulty())).toString() : this.loading
    },

    latestBlockSuccessTxs():string {
      return this.dataRecieved ? this.block.getStats().successfulTxs.toString() : this.loading
    },

    latestBlockFailedTxs():string {
      return this.dataRecieved ? this.block.getStats().failedTxs.toString() : this.loading
    },

    latestBlockPendingTxs():string {
      return this.dataRecieved ? this.block.getStats().pendingTxs.toString() : this.loading
    },

    secSinceLastBlock():string {
      return this.seconds.toString()
    }
  },
  created() {
    const lastBlock = this.$store.getters.getBlocks[0]
    if (lastBlock) {
      this.setBlock(this.$store.getters.getBlocks[0])
      this.startCount()
    }
  },
  mounted() {
    this.$eventHub.$on(sEvents.newBlock, _block => {
      this.setBlock(this.$store.getters.getBlocks[0])
      this.startCount()
    })
  },

  beforeDestroy() {
    clearInterval(this.secondsInterval)
    this.$eventHub.$off([sEvents.pastBlocksR, sEvents.newBlock])
  },

  methods: {
    setBlock(newBlock: Block) {
      this.dataRecieved = true
      this.block = newBlock
    },

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
    },

    getTHs(_num: string) {
      return new bn(_num).dividedBy('1e12').toNumber()
    },

    startCount() {
      this.secondsInterval = setInterval(() => {
        this.seconds = Math.ceil((new Date().getTime() - this.block.getTimestamp()) / 1000)
      }, 1000)
    }
  }
}
