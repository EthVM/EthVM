<template>
  <v-layout column justify-center>
    <app-chart
      type="line"
      :data="chartData"
      :options="chartOptions"
      :redraw="redraw"
      :chart-title="newTitle"
      :chart-description="newDescription"
      unfilled="true"
      :footnote-arr="footnote"
    ></app-chart>
  </v-layout>
</template>

<script lang="ts">
import { Events as sEvents } from 'ethvm-common'
import BN from 'bignumber.js'
import AppChart from '@app/components/ui/AppChart.vue'
import ethUnits from 'ethereumjs-units'
import { Vue, Component } from 'vue-property-decorator'

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

@Component({
  components: {
    AppChart
  }
})
export default class ChartLiveTxFees extends Vue {
  data() {
    return {
      chartData: {},
      chartOptions: lineOptions,
      redraw: false,
      newTitle: title,
      newDescription: description,
      footnote: [
        {
          color: 'txFail',
          text: this.$i18n.t('footnote.aveTxFees'),
          icon: 'fa fa-circle'
        },
        {
          color: 'txPen',
          text: this.$i18n.t('footnote.aveGasPrice'),
          icon: 'fa fa-circle'
        }
      ]
    }
  }

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
          this.chartData.datasets[0].data.push(ethUnits.convert(_tempD.avgTxsFees, 'wei', 'eth'))
          this.chartData.datasets[0].data.shift()
          this.chartData.datasets[1].data.push(ethUnits.convert(_tempD.avgGasPrice, 'wei', 'gwei'))
          this.chartData.datasets[1].data.shift()
        }
      }
    })
  }

  beforeDestroy() {
    this.$eventHub.$off(sEvents.pastBlocksR)
    this.$eventHub.$off(sEvents.newBlock)
  }

  get initData() {
    const data = {
      labels: [],
      avgFees: [],
      avgPrice: []
    }
    const latestBlocks = this.$store.getters.getBlocks.slice(0, MAX_ITEMS)
    latestBlocks.forEach(_block => {
      data.labels.unshift(_block.getNumber())
      const _tempD = _block.getStats()
      data.avgFees.unshift(ethUnits.convert(_tempD.avgTxsFees, 'wei', 'eth'))
      data.avgPrice.unshift(ethUnits.convert(_tempD.avgGasPrice, 'wei', 'gwei'))
    })
    return {
      labels: data.labels,
      datasets: [
        {
          label: 'Avg Tx Fees (ETH)',
          borderColor: '#40ce9c',
          backgroundColor: '#40ce9c',
          data: data.avgFees,
          yAxisID: 'y-axis-1',
          fill: false
        },
        {
          label: 'Avg Gas Price (GWEI)',
          borderColor: '#eea66b',
          backgroundColor: '#eea56b',
          data: data.avgPrice,
          yAxisID: 'y-axis-2',
          fill: false
        }
      ]
    }
  }
}
</script>
