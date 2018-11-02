<template>
  <v-layout column justify-center>
    <vue-chart type="bar" :data="chartData" :options="chartOptions" :chartTitle="newTitle" :chartDescription="newDescription" :redraw="redraw" :footnoteArr="footnote"></vue-chart>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Events as sEvents } from 'ethvm-common'
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
          beginAtZero: true
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
          beginAtZero: true
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
  data() {
    return {
      chartData: {},
      chartOptions: barOptions,
      redraw: false,
      newTitle: title,
      newDescription: description,
      footnote: [
        {
          color: '#40ce9c',
          text: this.$i18n.t('footnote.success'),
          icon: 'fa fa-circle'
        },
        {
          color: '#fe136c',
          text: this.$i18n.t('footnote.failed'),
          icon: 'fa fa-circle'
        },
        {
          color: '#eea66b',
          text: this.$i18n.t('footnote.pending'),
          icon: 'fa fa-circle'
        }
      ]
    }
  },
  created() {
    this.chartData = this.initData
    this.$eventHub.$on(sEvents.pastBlocksR, () => {
      this.chartData = this.initData
      this.redraw = true
    })
    this.$eventHub.$on(sEvents.newBlock, _block => {
      if (this.chartData.datasets[0]) {
          this.redraw = false
           const _tempD = _block.getStats()
          this.chartData.labels.push(_block.getNumber())
          this.chartData.labels.shift()
          this.chartData.datasets[0].data.push(0) //pending tx ev
          this.chartData.datasets[0].data.shift()
          this.chartData.datasets[1].data.push(_tempD.successfulTxs)
          this.chartData.datasets[1].data.shift()
          this.chartData.datasets[2].data.push(_tempD.failedTxs)
          this.chartData.datasets[2].data.shift()
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
        data.labels.unshift(_block.getNumber())
        const _tempD = _block.getStats()
        data.sData.unshift(new BN(_tempD.successfulTxs).toNumber())
        data.fData.unshift(new BN(_tempD.failedTxs).toNumber())
        data.pData.unshift(new BN(0).toNumber()) //pending tx ev
      })
      return {
        labels: data.labels,
        datasets: [
          {
            label: 'Pending',
            backgroundColor: '#eea66b',
            borderColor: '#eea66b',
            data: data.pData,
            type: 'line',
            fill: false,
            yAxisID: 'y-axis-2'
          },
          {
            label: 'Sucessfull',
            backgroundColor: '#40ce9c',
            data: data.sData,
            yAxisID: 'y-axis-1'
          },
          {
            label: 'Failed',
            backgroundColor: '#fe136c',
            data: data.fData,
            yAxisID: 'y-axis-1'
          }
        ]
      }
    }
  }
})
</script>
