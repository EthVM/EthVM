<template>
  <div id="GraphsRealChart" class="real-chart">

    <div class="graphs">
      <vue-chart type="scatter" :data="chartData" :options="chartOptions"></vue-chart>
    </div>

  </div>
</template>

<script lang="ts">
/* To use a scatter chart, data must be passed as objects containing X and Y properties */

import Vue from 'vue'
import VueChart from 'vue-chart-js'
import newData from '@/sampleData/scatterChartData.json'
import newOptions from '@/sampleData/scatterChartOptions.json'
export default Vue.extend({
  name: 'BarChart',
  components: {
    VueChart
  },
  data: () => ({
    chartData: newData,
    chartOptions: newOptions
  })

})
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/Graphs/GraphsRealChart.less";
</style>
