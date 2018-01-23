<template>
<small-block-component :title="blockTitle"
                       :value="hashRate"
                       :icon-name="blockIconType"
                       :icon-color="blockIconColor">
</small-block-component>

</template>

<script lang="ts">
import Vue from 'vue';
import { Block } from '@/libs';
import sEvents from '@/configs/socketEvents.json';
import bn from 'bignumber.js'
let getAvgHashRate = (_blocks: Array<Block>): number => {
  let avgTime = new bn(0)
  _blocks.forEach((_block)=>{
    let _tempD = _block.getStats()
    avgTime = avgTime.add(new bn(_tempD.blockTime))
  })
  avgTime = avgTime.div(_blocks.length)
  return new bn(_blocks[0].getDifficulty().toNumber()).div(avgTime).div('1e12').round(2).toNumber()
}
export default Vue.extend({
  name: 'ShortDataLastBlock',
  data() {
    return {
      blockTitle: 'Hash Rate TH/s',
      blockIconType: 'hashtag',
      blockIconColor: '#fba893',
      hashRate: '0.0'

    }
  },
  created() {
    if (this.$store.getters.getBlocks.length) {
      this.hashRate = getAvgHashRate(this.$store.getters.getBlocks)
    }
    this.$eventHub.$on([
      sEvents.pastBlocksR,
      sEvents.newBlock
    ], () => {
      this.hashRate = getAvgHashRate(this.$store.getters.getBlocks)
    })
  },
  beforeDestroy() {
    this.$eventHub.$off([
      sEvents.pastBlocksR,
      sEvents.newBlock
    ])
  }
})

</script>

<style scoped="" lang="less">
@import "~lessPath/NewHome/Sections/ShortData/ShortDataHashRate.less";
</style>
