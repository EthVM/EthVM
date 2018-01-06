<template>
<div id="GraphsBarChart"
     class="bar-chart">
  <div class="graphs">
    <vue-chart type="bar"
               :data="chartData"
               :options="chartOptions"
               :redraw="redraw"></vue-chart>
  </div>
</div>

</template>

<script lang="ts">
import Vue from 'vue'
import sEvents from '@/configs/socketEvents.json'
// import newData from '@/sampleData/barChartData.json'
import newOptions from '@/sampleData/barChartOptions.json'
import BN from 'bignumber.js'

export default Vue.extend({
  name: 'BarChart',
  data: () => ({
    chartData: {},
    chartOptions: newOptions,
    redraw: false
  }),
  mounted () {},
  created () {
    this.$eventHub.$on(sEvents.pastBlocksR, () => {
      this.chartData = this.initData
      this.redraw = true
    })
    this.$eventHub.$on(sEvents.newBlock, (_block) => {
      let _tempD = _block.getStats()
      if (this.chartData.datasets[0] && (_tempD.success !== '0x0' || _tempD.failed !== '0x0')) {
        this.redraw = false
        this.chartData.labels.push(_block.getNumber().toNumber())
        this.chartData.labels.shift()
        this.chartData.datasets[0].data.push(new BN(_tempD.success).toNumber())
        this.chartData.datasets[0].data.shift()
        this.chartData.datasets[1].data.push(new BN(_tempD.failed).toNumber())
        this.chartData.datasets[1].data.shift()
      }
    })
  },
  beforeDestroy () {
    this.$eventHub.$off(sEvents.pastBlocksR)
  },
  computed: {
    initData () {
      let data = {
        labels: [],
        sData: [],
        fData: []
      }
      let latestBlocks = this.$store.getters.getBlocks.slice(0, 10)
      latestBlocks.forEach((_block) => {
        data.labels.push(_block.getNumber().toNumber())
        let _tempD = _block.getStats()
        data.sData.push(new BN(_tempD.success).toNumber())
        data.fData.push(new BN(_tempD.failed).toNumber())
      })
      return {
        'labels': data.labels,
        'datasets': [
          {
            'label': 'Sucessfull',
            'backgroundColor': '#6dcff6',
            'data': data.sData
          },
          {
            'label': 'Failed',
            'backgroundColor': '#FBA893',
            'data': data.fData
          }
        ]
      }
    }
  }

})
</script>

<style scoped="" lang="less">
@import "~lessPath/NewHome/Sections/Graphs/GraphsBarChart.less";
</style>
