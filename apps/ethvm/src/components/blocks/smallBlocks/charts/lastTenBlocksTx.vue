<template>
  <v-layout column justify-center>
    <vue-chart type="bar" :data="chartData" :options="chartOptions" :redraw="redraw"></vue-chart>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Events as sEvents } from 'ethvm-models'
import BN from 'bignumber.js'

const MAX_ITEMS = 10

const barOptions = {
  title: {
    text: 'Transactions from the last 10 blocks'
  },
  responsive: true,
  scales: {
    yAxes: [
      {
        stacked: true,
        ticks: {
          beginAtZero: false
        },
        gridLines: {
          color: 'rgba(0, 0, 0, 0)'
        }
      }
    ],
    xAxes: [
      {
        stacked: true,
        display: false
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
    redraw: false
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
          this.chartData.labels.push(_block.getNumber())
          this.chartData.labels.shift()
          this.chartData.datasets[0].data.push(_tempD.success)
          this.chartData.datasets[0].data.shift()
          this.chartData.datasets[1].data.push(_tempD.failed)
          this.chartData.datasets[1].data.shift()
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
        fData: []
      }
      const latestBlocks = this.$store.getters.getBlocks.slice(0, MAX_ITEMS)
      latestBlocks.forEach(_block => {
        data.labels.unshift(_block.getNumber())
        const _tempD = _block.getStats()
        data.sData.unshift(new BN(_tempD.success).toNumber())
        data.fData.unshift(new BN(_tempD.failed).toNumber())
      })
      return {
        labels: data.labels,
        datasets: [
          {
            label: 'Sucessfull',
            backgroundColor: '#2779ff',
            data: data.sData
          },
          {
            label: 'Failed',
            backgroundColor: '#f9967b',
            data: data.fData
          }
        ]
      }
    }
  }
})
</script>
