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
import BN from 'bignumber.js'

let MAX_ITEMS = 10

let barOptions = {
  'title': {
    'display': true,
    'text': 'Transactions from the last 10 blocks'

  },
  'responsive': true,
  'scales': {
    'yAxes': [
      {
        'stacked': true,
        'ticks': {
          'beginAtZero': false
        },
        'gridLines': {
          'color': 'rgba(0, 0, 0, 0)'
        }
      }
    ],
    'xAxes': [
      {
        'stacked': true,
        'display': false
      }
    ]
  },
  'tooltips': {
    'backgroundColor': '#686868'
  },
  'barShowLabels': true,
  'legend': {
    'display': false
  },
  'layout': {
    'padding': {
      'left': 5,
      'right': 5,
      'top': 5,
      'bottom': 0
    }
  }

}
export default Vue.extend({

  name: 'BarChart',
  data: () => ({
    chartData: {},
    chartOptions: barOptions,
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
        this.redraw = false
        if (!_block.getIsUncle()) {
          let _tempD = _block.getStats()
          this.chartData.labels.push(_block.getNumber().toNumber())
          this.chartData.labels.shift()
          this.chartData.datasets[0].data.push(_tempD.success)
          this.chartData.datasets[0].data.shift()
          this.chartData.datasets[1].data.push(_tempD.failed)
          this.chartData.datasets[1].data.shift()
        }
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
        sData: [],
        fData: []
      }
      let latestBlocks = this.$store.getters.getBlocks.slice(0, MAX_ITEMS)
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
