<template>
  <div id="FramesHome" class="frames-home">



    <div class="row">
      <div class="col-md-3 col-sm-3 col-xs-6 block-container">
        <div class="block">
          <ShortDataLastBlock></ShortDataLastBlock>
        </div>
      </div>
      <div class="col-md-3 col-sm-3 col-xs-6 block-container">
        <div class="block">
          <ShortDataTimeSinceLastBlock></ShortDataTimeSinceLastBlock>
        </div>
      </div>
      <div class="col-md-3 col-sm-3 col-xs-6 block-container">
        <div class="block">
          <ShortDataHashRate></ShortDataHashRate>
        </div>
      </div>
      <div class="col-md-3 col-sm-3 col-xs-6 block-container">
        <div class="block">
          <ShortDataDifficulty></ShortDataDifficulty>
        </div>
      </div>
    </div>



    <div class="row">
      <div class="col-md-4 block-container">
        <div class="block">
          <GraphsRealChart></GraphsRealChart>
        </div>
      </div>

      <div class="col-md-4 block-container">
        <div class="block">
          <GraphsBarChart></GraphsBarChart>
        </div>
      </div>

      <div class="col-md-4 block-container">
        <div class="block">
          <GraphsLineChart></GraphsLineChart>
        </div>
      </div>
    </div>



    <div class="row">
      <div class="col-md-6 block-container">
        <div class="block">
          <TablesLatestBlocks></TablesLatestBlocks>
        </div>
      </div>

      <div class="col-md-6 block-container">
        <div class="block">
          <TablesLastTransactions></TablesLastTransactions>
        </div>
      </div>
    </div>



  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'FramesHome',
    data () {
      return {

      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Frames/FramesHome.less";
</style>



