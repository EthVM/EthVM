<template>
  <div class="chart-area">
        <div class="chart-content">
          <vue-chart type="line" :data="chartData" :options="newOptions"></vue-chart>
        </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue'
import VueChart from 'vue-chart-js'
import newData from '@/sampleData/lineChartData.json'
import newOptions from '@/sampleData/lineChartOptions.json'
export default Vue.extend({
  name: 'BarChart',
  components: {
    VueChart
  },
  data: () => ({
    chartData: newData,
    newOptions: newOptions
  })

})
</script>
 

</script>
<style scoped lang="less">
@import '~lessPath/globalVars.less';
@import '~lessPath/chart.less';
</style>
