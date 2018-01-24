<template>
    <div class="latest-blocks">
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
        <div class="row ">
            <div class="table-data">
                <tables-latest-blocks-new></tables-latest-blocks-new>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: 'FramesLatestBlocks',
    data() {
        return {

        }
    }
})
</script>
<style scoped lang="less">
@import "~lessPath/NewHome/Frames/FramesLatestBlocks.less";
</style>
