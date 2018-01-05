<template>
  <div id="ShortDataTimeSinceLastBlock" class="time-since-last-block">

    <p class="block-title">Time Since Last Block</p>

    <div class="bottom-block">
      <div class="icon-block"><icon name='clock-o' scale='1'></icon></div>
      <p class="block-value">{{seconds}} Sec</p>
    </div>
    
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'ShortDataLastBlock',
    data () {
      return {
        seconds: 0
      }
    },
    mounted () {
      let parent = this
      setInterval(() => {
        if (!this.$store.getters.getLatestBlock) {
          parent.seconds = 'loading'
          return
        }
        parent.seconds = new Date().getTime() - this.$store.getters.getLatestBlock.getTimestamp().toDate()
      }, 1000)
    },
    computed: {}
  })
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/ShortData/ShortDataTimeSinceLastBlock.less";
</style>
