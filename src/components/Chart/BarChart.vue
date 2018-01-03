<template>
  <div class="chart-area">
        <div class="chart-content">
          <vue-chart type="bar" :data="chartData"></vue-chart>
        </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue'
import VueChart from 'vue-chart-js'
import newData from '@/sampleData/databarchart.json'
import newOptions from '@/sampleData/dataBarChartOptions.json'
export default Vue.extend({
  name: 'BarChart',
  components: {
    VueChart
  },
  data: () => ({
    type: 'bar',
    chartData: newData,
    options: newOptions
  })

})
</script>
 

</script>
<style scoped lang="less">
@import '~lessPath/globalVars.less';
@import '~lessPath/chart.less';
</style>
