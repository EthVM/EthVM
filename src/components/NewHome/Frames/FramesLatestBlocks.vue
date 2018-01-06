<template>
  <div class="latest-blocks">
    <div class="block-container">
      <div class="block">
        <SinglePagesLatestBlocks></SinglePagesLatestBlocks>
      </div>
    </div>
    

  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'FramesContact',
    data () {
      return {

      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Frames/FramesLatestBlocks.less";
</style>
