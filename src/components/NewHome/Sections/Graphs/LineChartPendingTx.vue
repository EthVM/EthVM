<template>
<div id="GraphsRealChart"
     class="real-chart">
  <div class="graphs">
    <vue-chart type="line"
               :data="chartData"
               :options="chartOptions"
               :redraw="redraw"></vue-chart>
  </div>
</div>

</template>

<script lang="ts">
/* To use a scatter chart, data must be passed as objects containing X and Y properties */

import Vue from 'vue'
import sEvents from '@/configs/socketEvents.json'
let newOptions = {
  'title': {
    'text': 'Pending Tx'
  },

  'responsive': true,
  'scales': {
    'yAxes': [
      {
        'ticks': {
          'beginAtZero': false
        }
      }
    ],
    'xAxes': [
      {
        'display': false
      }
    ]
  },

  'elements': {
    'line': {
      'borderColor': 'purple',
      'fill': false
    },
    'point': {
      'backgroundColor': 'purple',
      'borderColor': 'purple'
    }

  },
  'scaleShowLabels': false

}
let MAX_ITEMS = 10
export default Vue.extend({
  name: 'pendingTxsChart',
  data: () => ({
    chartData: {},
    chartOptions: newOptions,
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
          this.chartData.labels = this.chartData.labels.map((item, idx) => {
            return Math.ceil((new Date().getTime() - this.chartData.datasets[0].blockTimes[idx]) / 1000) + ' secs ago'
          })
          let _tempD = _block.getStats()
          this.chartData.labels.push(Math.ceil((new Date().getTime() - _block.getTimestamp().toDate()) / 1000) + ' secs ago')
          this.chartData.labels.shift()
          this.chartData.datasets[0].data.push(_tempD.pendingTxs)
          this.chartData.datasets[0].blockTimes.push(_block.getTimestamp().toDate())
          this.chartData.datasets[0].data.shift()
          this.chartData.datasets[0].blockTimes.shift()
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
        txCount: [],
        blockTimes: []
      }
      let latestBlocks = this.$store.getters.getBlocks.slice(0, MAX_ITEMS)
      latestBlocks.forEach((_block) => {
        data.labels.unshift(Math.ceil((new Date().getTime() - _block.getTimestamp().toDate()) / 1000) + ' secs ago')
        data.blockTimes.unshift(_block.getTimestamp().toDate())
        let _tempD = _block.getStats()
        data.txCount.unshift(_tempD.pendingTxs)
      })
      return {
        'labels': data.labels,
        'datasets': [
          {
            'pointHoverBackgroundColor': 'pink',
            'pointHoverBorderColor': 'pink',
            'data': data.txCount,
            'blockTimes': data.blockTimes
          }
        ]
      }
    }
  }

})
</script>

<style scoped="" lang="less">
@import "~lessPath/NewHome/Sections/Graphs/GraphsRealChart.less";
</style>
