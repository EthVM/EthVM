<template>
  <block-component
    :title="blockTitle"
    backgroundColor="color5"
    :value="hashRate"
    :icon-name="blockIconType"
    :icon-color="blockIconColor">
  </block-component>
</template>

<script lang="ts">
import sEvents from '@app/configs/socketEvents.json'
import { Block } from '@app/libs'
import BN from 'bignumber.js'
import Vue from 'vue'

const getAvgHashRate = (blocks: Block[]): number => {
  if (blocks.length === 0) {
    return new BN(0).toNumber()
  }

  let avgTime = new BN(0)
  blocks.forEach(block => {
    const stats = block.getStats()
    avgTime = avgTime.add(new BN(stats.blockTime))
  })
  avgTime = avgTime.div(blocks.length)
  return new BN(blocks[0].getDifficulty().toNumber())
    .div(avgTime)
    .div('1e12')
    .round(2)
    .toNumber()
}

export default Vue.extend({
  name: 'ShortDataLastBlock',
  data() {
    return {
      blockTitle: this.$i18n.t('smlBlock.hashR'),
      blockIconType: 'hashtag',
      blockIconColor: '#fba893',
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
