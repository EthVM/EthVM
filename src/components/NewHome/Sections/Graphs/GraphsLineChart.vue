<template>
  <div id="GraphsLineChart" class="line-chart">
    <div class="graphs">
     <vue-chart type="line" :data="chartData" :options="chartOptions" :redraw="redraw"></vue-chart>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import sEvents from '@/configs/socketEvents.json'
// import newData from '@/sampleData/lineChartData.json'
import newOptions from '@/sampleData/lineChartOptions.json'
import BN from 'bignumber.js'
import ethUnits from 'ethereumjs-units'

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
        this.chartData.datasets[0].data.push(ethUnits.convert(new BN(_tempD.avgTxFees).toFixed(), 'wei', 'eth'))
        this.chartData.datasets[0].data.shift()
        this.chartData.datasets[1].data.push(ethUnits.convert(new BN(_tempD.avgGasPrice).toFixed(), 'wei', 'gwei'))
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
        avgFees: [],
        avgPrice: []
      }
      let latestBlocks = this.$store.getters.getBlocks.slice(0, 10)
      latestBlocks.forEach((_block) => {
        data.labels.push(_block.getNumber().toNumber())
        let _tempD = _block.getStats()
        data.avgFees.push(ethUnits.convert(new BN(_tempD.avgTxFees).toFixed(), 'wei', 'eth'))
        data.avgPrice.push(ethUnits.convert(new BN(_tempD.avgGasPrice).toFixed(), 'wei', 'gwei'))
      })
      return {
        'labels': data.labels,
        'datasets': [
          {
            'label': 'avg Tx Fees (ETH)',
            'backgroundColor': 'rgba(196, 93, 105, 0.3)',
            'pointBackgroundColor': '#49e3ea',
            'data': data.avgFees,
            'yAxisID': 'y-axis-1'
          },
          {
            'label': 'avg Gas Price (GWEI)',
            'backgroundColor': 'rgba(32, 162, 219, 0.3)',
            'data': data.avgPrice,
            'yAxisID': 'y-axis-2'
          }]
      }
    }
  }

})
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/Graphs/GraphsLineChart.less";
</style>
