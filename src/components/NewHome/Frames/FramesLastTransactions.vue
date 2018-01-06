<template>
  <div class="last-transactions">
    <div class="block-container">
      <div class="block">
        <SinglePagesLastTransactions></SinglePagesLastTransactions>
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
    @import "~lessPath/NewHome/Frames/FramesLastTransactions.less";
</style>
