<template>
  <block-component :title="blockTitle" :value="seconds+ ' sec'" :icon-name="blockIconType" :icon-color="blockIconColor"></block-component>
</template>
<script lang="ts">
  import Vue from 'vue';
  import sEvents from '@/configs/socketEvents.json';
  export default Vue.extend({
    name: 'ShortDataLastBlock',
    data() {
      return {
        blockTitle: 'Since Last Block',
        blockIconType: 'clock-o',
        blockIconColor: '#ffd800',
        lastBlockTime: 0,
        seconds: 0
      }
    },
    created() {
      if (this.$store.getters.getBlocks.length) {
        this.lastBlockTime = this.$store.getters.getBlocks[0].getTimestamp().toDate()
      }
      this.$eventHub.$on(sEvents.pastBlocksR, () => {
        this.lastBlockTime = this.$store.getters.getBlocks[0].getTimestamp().toDate()
      })
      this.$eventHub.$on(sEvents.newBlock, (_block) => {
        this.lastBlockTime = new Date().getTime()
      })
    },
    beforeDestroy() {
      this.$eventHub.$off([
        sEvents.pastBlocksR,
        sEvents.newBlock
      ])
    },
    mounted() {
      let parent = this
      setInterval(() => {
        if (!this.$store.getters.getBlocks.length) {
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
  //@import "~lessPath/NewHome/Sections/ShortData/ShortDataTimeSinceLastBlock.less";
</style>