<template>
<div id="GraphsBarChart">
  <vue-chart type="bar"
    :data="chartData"
    :options="chartOptions"
    :chartTitle="newTitle"
    :chartDescription="newDescription"
    :redraw="redraw">
  </vue-chart>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import sEvents from '@/configs/socketEvents.json'
import BN from 'bignumber.js'

const MAX_ITEMS = 10
const title = 'Tx Summary'
const description = 'Number of successful, failed, and pending transactions that have occured in the last 10 blocks'

const barOptions = {
  title: {
    text: 'Transactions (Last 10 blocks)'
  },
  responsive: true,
  scales: {
    yAxes: [
      {
        id: 'y-axis-1',
        stacked: false,
        ticks: {
          beginAtZero: false
        },
        gridLines: {
          color: 'rgba(0, 0, 0, 0)'
        },
        scaleLabel: {
          display: true,
          labelString: 'Sucessfull and Failed Tx '
        }
      },
      {
        id: 'y-axis-2',
        position: 'right',
        stacked: false,
        ticks: {
          beginAtZero: false
        },
        gridLines: {
          color: 'rgba(0, 0, 0, 0)'
        },
        scaleLabel: {
          display: true,
          labelString: 'Pending Tx'
        }
      }
    ],
    xAxes: [
      {
        stacked: false,
        display: false,
        categoryPercentage: 0.7
      }
    ]
  },

  barShowLabels: true
}
export default Vue.extend({
  name: 'BarChart',
  data: () => ({
    chartData: {},
    chartOptions: barOptions,
    redraw: false,
    newTitle: title,
    newDescription: description
  }),
  mounted() {},
  created() {
    this.chartData = this.initData
    this.$eventHub.$on(sEvents.pastBlocksR, () => {
      this.chartData = this.initData
      this.redraw = true
    })
    this.$eventHub.$on(sEvents.newBlock, _block => {
      if (this.chartData.datasets[0]) {
        this.redraw = false
        if (!_block.getIsUncle()) {
          const _tempD = _block.getStats()
          this.chartData.labels.push(_block.getNumber().toNumber())
          this.chartData.labels.shift()
          this.chartData.datasets[0].data.push(_tempD.pendingTxs)
          this.chartData.datasets[0].data.shift()
          this.chartData.datasets[1].data.push(_tempD.success)
          this.chartData.datasets[1].data.shift()
          this.chartData.datasets[2].data.push(_tempD.failed)
          this.chartData.datasets[2].data.shift()
        }
      }
    })
  },
  beforeDestroy() {
    this.$eventHub.$off(sEvents.pastBlocksR)
    this.$eventHub.$off(sEvents.newBlock)
  },
  computed: {
    initData() {
      const data = {
        labels: [],
        sData: [],
        fData: [],
        pData: []
      }
      const latestBlocks = this.$store.getters.getBlocks.slice(0, MAX_ITEMS)
      latestBlocks.forEach(_block => {
        data.labels.unshift(_block.getNumber().toNumber())
        const _tempD = _block.getStats()
        data.sData.unshift(new BN(_tempD.success).toNumber())
        data.fData.unshift(new BN(_tempD.failed).toNumber())
        data.pData.unshift(new BN(_tempD.pendingTxs).toNumber())
      })
      return {
        labels: data.labels,
        datasets: [
          {
            label: 'Pending',
            backgroundColor: '#7c76fc',
            borderColor: '#7c76fc',
            data: data.pData,
            type: 'line',
            fill: false,
            yAxisID: 'y-axis-2'
          },
          {
            label: 'Sucessfull',
            backgroundColor: '#20c0c7',
            data: data.sData,
            yAxisID: 'y-axis-1'
          },
          {
            label: 'Failed',
            backgroundColor: '#f9967b',
            data: data.fData,
            yAxisID: 'y-axis-1'
          }
        ]
      }
    }
  }
})
</script>
