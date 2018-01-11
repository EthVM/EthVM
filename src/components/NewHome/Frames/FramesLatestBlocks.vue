<template>

  <div class="latest-blocks">

    <div class="row">

      <div class="col-md-9">
        <div class="block the-table">
          <TablesLatestBlocks></TablesLatestBlocks>
        </div>
      </div>

      <div class="col-md-3">
        

        <div class="row">
          <div class="col-md-12 block-container">
            <div class="block">
             <GraphsRealChart></GraphsRealChart>
            </div>
          </div>
            
          <div class="col-md-12 block-container">
            <div class="block">
              <GraphsBarChart></GraphsBarChart>
            </div>
          </div>

          <div class="col-md-12 block-container">
            <div class="block">
              <GraphsLineChart></GraphsLineChart>
            </div>
          </div>
        </div>


      </div>
      
      

    </div>


    <div class="block-container">
      
    </div>
    

  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'FramesLatestBlocks',
    data () {
      return {

      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Frames/FramesLatestBlocks.less";
</style>
