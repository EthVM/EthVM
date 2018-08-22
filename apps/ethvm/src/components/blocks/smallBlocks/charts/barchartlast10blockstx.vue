<template>
<div id="GraphsBarChart">
  <vue-chart type="bar"
    :data="chartData"
    :options="chartOptions"
    :chartTitle="newTitle"
    :chartDescription="newDescription"
    :redraw="redraw"></vue-chart>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import sEvents from '@app/configs/socketEvents.json'
import BN from 'bignumber.js'
import { Block } from '@app/libs'

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
    this.$eventHub.$on(sEvents.newBlock, block => {
      if (this.chartData.datasets[0]) {
        this.redraw = false
        if (!block.getIsUncle()) {
          const stats = block.getStats()
          this.chartData.labels.push(block.getNumber().toNumber())
          this.chartData.labels.shift()
          this.chartData.datasets[0].data.push(stats.pendingTxs)
          this.chartData.datasets[0].data.shift()
          this.chartData.datasets[1].data.push(stats.success)
          this.chartData.datasets[1].data.shift()
          this.chartData.datasets[2].data.push(stats.failed)
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
      const data: {
        labels: Array<string>
        sData: Array<BN>
        fData: Array<BN>
        pData: Array<BN>
      } = {
        labels: [],
        sData: [],
        fData: [],
        pData: []
      }
      const latestBlocks: Array<Block> = this.$store.getters.getBlocks.slice(0, MAX_ITEMS)
      latestBlocks.forEach((block: Block) => {
        data.labels.unshift(block.getNumber().toNumber())
        const stats = block.getStats()
        data.sData.unshift(new BN(stats.successfulTxs))
        data.fData.unshift(new BN(stats.failedTxs))
        data.pData.unshift(new BN(stats.pendingTxs))
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
