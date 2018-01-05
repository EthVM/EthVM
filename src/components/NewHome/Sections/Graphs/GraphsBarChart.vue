<template>
  <div id="GraphsBarChart" class="bar-chart">
    <div class="graphs">
     <vue-chart type="bar" :data="chartData" :options="chartOptions"></vue-chart>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VueChart from 'vue-chart-js'
import newData from '@/sampleData/barChartData.json'
import newOptions from '@/sampleData/barChartOptions.json'
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
  @import "~lessPath/NewHome/Sections/Graphs/GraphsBarChart.less";
</style>
