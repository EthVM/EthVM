<template>
  <block-component :title="blockTitle" :colorType="type" :value="hashRate" :icon="iconType">
  </block-component>
</template>

<script lang="ts">
import sEvents from '@app/configs/socketEvents.json'
import { Block } from '@app/models'
import bn from 'bignumber.js'
import Vue from 'vue'

const getAvgHashRate = (blocks: Block[]): number => {
  let avg = new bn(0)

  if (!blocks || blocks.length == 0) {
    return avg.toNumber()
  }

  blocks.forEach(block => {
    const stats = block.getStats()
    const blockTime = stats.blockTime
    avg = avg.add(new bn(blockTime))
  })
  avg = avg.div(blocks.length)
  if (avg.isZero) {
    return avg.toNumber()
  }

  const difficulty = blocks[0].getDifficulty().toNumber()
  return new bn(difficulty)
    .div(avg)
    .div('1e12')
    .round(2)
    .toNumber()
}

export default Vue.extend({
  name: 'ShortDataLastBlock',
  data() {
    return {
      blockTitle: this.$i18n.t('smlBlock.hashR'),
      iconType: 'fa fa-hashtag white--text',
      type: 'accent white--text',
      hashRate: this.$i18n.t('message.load')
    }
  },
  created() {
    if (this.$store.getters.getBlocks.length) {
      this.hashRate = getAvgHashRate(this.$store.getters.getBlocks)
    }
    this.$eventHub.$on([sEvents.pastBlocksR, sEvents.newBlock], () => {
      this.hashRate = getAvgHashRate(this.$store.getters.getBlocks)
    })
  },
  beforeDestroy() {
    this.$eventHub.$off([sEvents.pastBlocksR, sEvents.newBlock])
  }
})
</script>

<style scoped lang="less">
</style>
