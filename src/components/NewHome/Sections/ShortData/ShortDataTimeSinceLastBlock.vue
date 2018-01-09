<template>
<div id="ShortDataTimeSinceLastBlock"
     class="time-since-last-block">
  <p class="block-title">Time Since Last Block</p>
  <div class="bottom-block">
    <div class="icon-block">
      <icon name='clock-o'
            scale='1'></icon>
    </div>
    <p class="block-value">{{seconds}} Sec</p>
  </div>
</div>

</template>

<script lang="ts">
import Vue from 'vue'
import sEvents from '@/configs/socketEvents.json'
export default Vue.extend({
  name: 'ShortDataLastBlock',
  data () {
    return {
      lastBlockTime: 0,
      seconds: 0
    }
  },
  created () {
    this.$eventHub.$on(sEvents.pastBlocksR, () => {
      this.lastBlockTime = this.$store.getters.getLatestBlock.getTimestamp().toDate()
    })
    this.$eventHub.$on(sEvents.newBlock, (_block) => {
      this.lastBlockTime = new Date()
    })
  },
  beforeDestroy () {
    this.$eventHub.$off(sEvents.pastBlocksR)
    this.$eventHub.$off(sEvents.newBlock)
  },
  mounted () {
    let parent = this
    setInterval(() => {
      if (!this.$store.getters.getLatestBlock) {
        parent.seconds = 'loading'
        return
      }
      parent.seconds = Math.ceil((new Date().getTime() - parent.lastBlockTime) / 1000)
    }, 1000)
  },
  computed: {}
})
</script>

<style scoped="" lang="less">
@import "~lessPath/NewHome/Sections/ShortData/ShortDataTimeSinceLastBlock.less";
</style>
