<template>
  <v-layout column justify-center>
    <vue-chart type="line" :data="chartData" :options="chartOptions" :redraw="redraw" :chartTitle="newTitle" :chartDescription="newDescription" unfilled="true" :footnoteArr="footnote"></vue-chart>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import sEvents from '@app/configs/socketEvents.json'
import BN from 'bignumber.js'
import ethUnits from 'ethereumjs-units'

const title = 'Average Tx Costs'
const description = 'Average transaction fees and average gas price in the last 10 blocks'
const MAX_ITEMS = 10
const lineOptions = {
  title: {
    text: 'Average Tx Fees',
    lineHeight: 1
  },
  responsive: true,
  scales: {
    yAxes: [
      {
        position: 'left',
        id: 'y-axis-1',
        ticks: {
          beginAtZero: true
        },
        gridLines: {
          color: 'rgba(0, 0, 0, 0)'
        },
        scaleLabel: {
          display: true,
          labelString: 'Tx Fees ETH'
        }
      },
      {
        id: 'y-axis-2',
        position: 'right',
        ticks: {
          beginAtZero: true
        },
        gridLines: {
          color: 'rgba(0, 0, 0, 0)'
        },
        scaleLabel: {
          display: true,
          labelString: ' Gas Price GWEI'
        }
      }
    ],
    xAxes: [
      {
        display: false
      }
    ]
  },

  scaleShowLabels: false
}

import { common } from '@app/helpers'

export default Vue.extend({
  name: 'BarChart',
  data() {
    return {
      chartData: {},
      chartOptions: lineOptions,
      redraw: false,
      newTitle: title,
      newDescription: description,
      footnote: [
        {
          color: '#40ce9c',
          text: this.$i18n.t('footnote.aveTxFees'),
          icon: 'fa fa-circle'
        },
        {
          color: '#eea66b',
          text: this.$i18n.t('footnote.aveGasPrice'),
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
        if (!_block.getIsUncle()) {
          const _tempD = _block.getStats()
          this.chartData.labels.push(_block.getNumber())
          this.chartData.labels.shift()
          this.chartData.datasets[0].data.push(common.EthValue(_tempD.avgTxsFees).toEth())
          this.chartData.datasets[0].data.shift()
          this.chartData.datasets[1].data.push(common.EthValue(_tempD.avgGasPrice).toEth())
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
        avgFees: [],
        avgPrice: []
      }
      const latestBlocks = this.$store.getters.getBlocks.slice(0, MAX_ITEMS)
      latestBlocks.forEach(_block => {
        data.labels.unshift(_block.getNumber())
        const _tempD = _block.getStats()
        data.avgFees.unshift(common.EthValue(_tempD.avgTxsFees).toEth())
        data.avgPrice.unshift(common.EthValue(_tempD.avgTxsFees).toEth())
      })
      return {
        labels: data.labels,
        datasets: [
          {
            label: 'avg Tx Fees (ETH)',
            borderColor: '#40ce9c',
            backgroundColor: '#40ce9c',
            data: data.avgFees,
            yAxisID: 'y-axis-1',
            fill: false
          },
          {
            label: 'avg Gas Price (GWEI)',
            borderColor: '#eea66b',
            backgroundColor: '#eea56b',
            data: data.avgPrice,
            yAxisID: 'y-axis-2',
            fill: false
          }
        ]
      }
    }
  },
  mounted: function() {}
})
</script>
