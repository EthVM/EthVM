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
import BN from 'bignumber.js'
import ethUnits from 'ethereumjs-units'
let MAX_ITEMS = 10
let lineOptions = {
  'title': {
    'display': true,
    'padding': 5,
    'text': 'Average Tx Fees',
    'lineHeight': 1
  },
  'legend': {
    'display': false

  },
  'responsive': true,
  'scales': {
    'yAxes': [{
      'position': 'left',
      'id': 'y-axis-1',
      'ticks': {
        'beginAtZero': true
      },
      'gridLines': {
        'color': 'rgba(0, 0, 0, 0)'
      }
    }, {
      'id': 'y-axis-2',
      'position': 'right',
      'ticks': {
        'beginAtZero': true
      },
      'gridLines': {
        'color': 'rgba(0, 0, 0, 0)'
      }
    }],
    'xAxes': [{
      'display': false
    }]
  },
  'tooltips': {
    'backgroundColor': '#686868',
    'titleFontColor': 'white',
    'bodyFontColor': 'white'
  },
  'elements': {
    'line': {
      'borderColor': '#c271f5'
    },
    'point': {
      'backgroundColor': '#c271f5',
      'hoverRadius': 6,
      'borderColor': '#c271f5',
      'borderWidth': 2
    }

  },
  'scaleShowLabels': false,
  'layout': {
    'padding': {
      'left': 5,
      'right': 5,
      'top': 5,
      'bottom': 0
    }
  }
}
let getChartData = (_blocks) => {
  let data = {
    labels: [],
    txFees: [],
    gasPrice: []
  }
  _blocks.forEach((_block) => {
    let _tempD = _block.getStats()
    data.labels.unshift(_block.getNumber().toNumber())
    data.txFees.unshift(ethUnits.convert(new BN(_tempD.avgTxFees).toFixed(), 'wei', 'eth'))
    data.gasPrice.unshift(ethUnits.convert(new BN(_tempD.avgGasPrice).toFixed(), 'wei', 'gwei'))
  })
  return data
}
export default Vue.extend({
  name: 'BarChart',
  data: () => ({
    chartData: {},
    chartOptions: lineOptions,
    redraw: false
  }),
  mounted () {},
  created () {
    this.chartData = this.initData
    this.$eventHub.$on(sEvents.pastBlocksR, () => {
      this.chartData = this.initData
      this.redraw = true
    })
    this.$eventHub.$on(sEvents.newBlock, (_block) => {
      if (this.chartData.datasets[0]) {
        let data = getChartData(this.$store.getters.getBlocks.slice(0, MAX_ITEMS))
        this.redraw = false
        this.chartData.labels = data.labels
        this.chartData.datasets[0].data = data.txFees
        this.chartData.datasets[1].data = data.gasPrice
      }
    })
  },
  beforeDestroy () {
    this.$eventHub.$off(sEvents.pastBlocksR)
    this.$eventHub.$off(sEvents.newBlock)
  },
  computed: {
    initData () {
      let data = {
        labels: [],
        avgFees: [],
        avgPrice: []
      }
      let latestBlocks = this.$store.getters.getBlocks.slice(0, MAX_ITEMS)
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
