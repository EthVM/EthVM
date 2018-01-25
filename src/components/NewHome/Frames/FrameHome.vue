<template>
    <div id="FramesHome" class="frames-home">
        <div class="row">
            <div class="col-md-3 col-sm-3 col-xs-6 short-data">         
                <short-data-last-block></short-data-last-block>       
            </div>
            <div class="col-md-3 col-sm-3 col-xs-6 short-data">
                <short-data-time-since-last-block></short-data-time-since-last-block>    
            </div>
            <div class="col-md-3 col-sm-3 col-xs-6 short-data"> 
                <short-data-hash-rate></short-data-hash-rate>
            </div>
            <div class="col-md-3 col-sm-3 col-xs-6 short-data">
                    <short-data-difficulty></short-data-difficulty>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4 chart-data">               
                    <line-chart-pending-tx></line-chart-pending-tx>     
            </div>
            <div class="col-md-4 chart-data">           
                   <bar-chart-last-ten-blocks-tx></bar-chart-last-ten-blocks-tx>
                
            </div>
            <div class="col-md-4 chart-data">   
                    <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
            </div>
        </div>
        <div class="row d-flex justify-content-center">
            <div class="col-md-6 table-data ">     
                    <tables-latest-blocks-new :max-items="20"></tables-latest-blocks-new>
            </div>
            <div class="col-md-6 table-data">          
                   <table-transactions-new :transactions="txs"></table-transactions-new>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
const MAX_ITEMS = 20
export default Vue.extend({
  name: 'FramesHome',
  data () {
    return {}
  },
  created (){},
  computed:{
    txs(){
        if(this.$store.getters.getTxs.length) return this.$store.getters.getTxs.slice(0, MAX_ITEMS)
        else return []
    }
  }
})
</script>
<style scoped lang="less">
@import "~lessPath/NewHome/Frames/FramesHome.less";
</style>
