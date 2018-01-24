<template>

  <div class="latest-blocks">

    <div class="row">

      <div class="col-md-9">
        <div class="block the-table">
          <tables-latest-blocks-new></tables-latest-blocks-new>
        </div>
      </div>

      <div class="col-md-3">
       

        <div class="row">
          <div class=" block-container">
            <div class="block">
             <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
            </div>
          </div>
        </div>
        <div class="row">
       
               <bar-chart-last-ten-blocks-tx></bar-chart-last-ten-blocks-tx>
    
        </div>
        <div class="row">
         
              <line-chart-pending-tx></line-chart-pending-tx>
         
        </div>
        <div class="row">
          
              <line-chart-pending-tx></line-chart-pending-tx>
       
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
