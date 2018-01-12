<template>
    <div id="FramesHome" class="frames-home">
        <div class="row">
            <div class="col-md-3 col-sm-3 col-xs-6 block-container">
                <div class="block">
                    <small-block-component :title="firstTitle" :value="latestBlockNumber" :icon-name="firstIconType"></small-block-component>
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
        <div class="row table-block">
            <div class="col-md-6 block-container">
                <div class="block">
                    <TablesLatestBlocks frompage="from-home" :max-items="20"></TablesLatestBlocks>
                </div>
            </div>
            <div class="col-md-6 block-container">
                <div class="block">
                    <TablesLastTransactions frompage="from-home" :max-items="20"></TablesLastTransactions>
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
      firstTitle: 'Last Block',
      firstIconType: 'tachometer'
    }
  },
  computed: {
    latestBlockNumber: function () {
      if (!this.$store.getters.getBlocks[0]) {
        return 'loading'
      }
      return this.$store.getters.getBlocks[0].getIntNumber()
    }
  }
})
</script>
<style scoped lang="less">
@import "~lessPath/NewHome/Frames/FramesHome.less";
</style>
