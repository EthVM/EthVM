<template>
    <div class="frames-overview">
        <div class="row table-block">
            <div class="col-md-6 block-container">
                <div class="block">
                    <overview frompage="from-home" :max-items="20"></overview>
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
    return {}
  },
  created (){}
})
</script>
<style scoped lang="less">
@import "~lessPath/NewHome/Frames/FramesOverview.less";
</style>
