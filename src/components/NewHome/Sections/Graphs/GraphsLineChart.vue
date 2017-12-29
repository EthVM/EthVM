<template>
  <div id="GraphsLineChart" class="line-chart">

    <p>Line Chart</p>
    <p class="block-value">20 Sec</p>

  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'GraphsLineChart',
    data () {
      return {

      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/Graphs/GraphsLineChart.less";
</style>
