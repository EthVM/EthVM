<template>
  <block-component :title="blockTitle" backgroundColor="color5" :value="hashRate" :icon-name="blockIconType" :icon-color="blockIconColor"></block-component>
</template>

<script lang="ts">
import Vue from 'vue'
import { Block } from '@/libs'
import sEvents from '@/configs/socketEvents.json'
import bn from 'bignumber.js'

const getAvgHashRate = (blocks: Array<Block>): number => {
  let avgTime = new bn(0)
  blocks.forEach(block => {
    let stats = block.getStats()
    avgTime = avgTime.add(new bn(stats.blockTime))
  })
  avgTime = avgTime.div(blocks.length)
  return new bn(blocks[0].getDifficulty().toNumber())
    .div(avgTime)
    .div('1e12')
    .round(2)
    .toNumber()
}

export default Vue.extend({
  name: 'ShortDataLastBlock',
  data() {
    return {
      blockTitle: 'Hash Rate TH/s',
      blockIconType: 'hashtag',
      blockIconColor: '#fba893',
      hashRate: 'Loading'
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
