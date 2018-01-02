<template>
  <div class="chart-area">
        <div class ="chart-title">
          <p>Some Graph</p>
        </div>
        <div class="chart-content">
          <vue-chart type="bar" :data="chartData"></vue-chart>
        </div>
  </div>
</template>
 
<script lang="ts">
import VueChart from 'vue-chart-js'
import Vue from 'vue'
export default Vue.extend({
  name: 'BarChart',

  components: {
    VueChart
  },

  data: () => ({
    chartData: {
      labels: ['block 1', 'block 2', 'block 3', 'block 4', 'block 5', 'block 6', 'block 7'],
      datasets: [
        {
          label: 'Failed TX',
          backgroundColor: '#fba893',
          responsive: true,
          data: [15, 20, 30, 22, 43, 12, 11]
        },
        {
          label: 'Sucessfull Tx',
          backgroundColor: '#13a9ef',
          responsive: true,
          data: [20, 33, 30, 40, 82, 38, 73]
        }
      ]
    }
  })
})
</script>

<style scoped lang="less">
@import '~lessPath/globalVars.less';
@import '~lessPath/chart.less';
</style>
