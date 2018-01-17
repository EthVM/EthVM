<template>
    <div id="FramesHome" class="frames-home">
        <div class="row">
            <div class="col-md-3 col-sm-3 col-xs-6 block-container">
                <div class="block">
                    <short-data-last-block></short-data-last-block>
                </div>
            </div>
            <div class="col-md-3 col-sm-3 col-xs-6 block-container">
                <div class="block">
                    <short-data-time-since-last-block></short-data-time-since-last-block>
                </div>
            </div>
            <div class="col-md-3 col-sm-3 col-xs-6 block-container">
                <div class="block">
                    <short-data-hash-rate></short-data-hash-rate>
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
                    <line-chart-pending-tx></line-chart-pending-tx>
                </div>
            </div>
            <div class="col-md-4 block-container">
                <div class="block">
                    <bar-chart-last-ten-blocks-tx></bar-chart-last-ten-blocks-tx>
                </div>
            </div>
            <div class="col-md-4 block-container">
                <div class="block">
                    <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
                </div>
            </div>
        </div>
        <div class="row table-block">
            <div class="col-md-6 block-container">
                <div class="block">
                    <TablesLatestBlocks frompage="from-home" :max-items="20"></TablesLatestBlocks>
                </div>
            </div>
            <div class="col-md-6 block-container">
                <div class="block">
                    <latest-transactions frompage="from-home" :max-items="20"></latest-transactions>
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
