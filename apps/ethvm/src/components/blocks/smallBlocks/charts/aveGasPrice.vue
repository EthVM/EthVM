<template>
  <div id="GraphsLineChart" class="line-chart">

     <vue-chart type="line" :data="chartData"
                            :options="chartOptions"
                            :redraw="redraw"
                            :chartTitle="newTitle"
                            :chartDescription="newDescription"
                            unfilled="true"></vue-chart>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Events as sEvents } from 'ethvm-models'
import BN from 'bignumber.js'
import ethUnits from 'ethereumjs-units'

/* Time Variables: */
const STATES = {
  BEGIN: 'beginning',
  YEAR: 'year',
  MONTH: 'month',
  DAY: 'day'
}
const DES = {
  BEGIN: 'Average gas price in Ethereum blockchain since the ',
  OTHER: 'Average gas price in Ethereum blockchain in last '
}
const currentState = STATES.DAY
const stateChanged = false

/* Chart Details: */

const title = 'Gas Price'
let description = DES.OTHER + currentState
const MAX_ITEMS = 10
const lineOptions = {
  title: {
    text: 'Gas Price',
    lineHeight: 1
  },
  responsive: true,
  scales: {
    yAxes: [
      {
        position: 'left',
        ticks: {
          beginAtZero: true
        },
        gridLines: {
          color: 'rgba(0, 0, 0, 0)'
        },
        scaleLabel: {
          display: true,
          labelString: 'Gas Price (GWEI)'
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
export default Vue.extend({
  name: 'BarChart',
  data: () => ({
    chartData: {},
    chartOptions: lineOptions,
    redraw: false,
    newTitle: title,
    newDescription: description
  }),
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
          this.chartData.datasets[0].data.push(ethUnits.convert(new BN(_tempD.avgTxFees).toFixed(), 'wei', 'eth').substr(0, 8))
          this.chartData.datasets[0].data.shift()
          this.chartData.datasets[1].data.push(ethUnits.convert(new BN(_tempD.avgGasPrice).toFixed(), 'wei', 'gwei').substr(0, 5))
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
        avgPrice: [],
        sData: null
      }
      const latestBlocks = this.$store.getters.getBlocks.slice(0, MAX_ITEMS)
      latestBlocks.forEach(_block => {
        data.labels.unshift(_block.getNumber())
        const _tempD = _block.getStats()
        data.avgFees.unshift(ethUnits.convert(new BN(_tempD.avgTxFees).toFixed(), 'wei', 'eth').substr(0, 8))
        data.avgPrice.unshift(ethUnits.convert(new BN(_tempD.avgGasPrice).toFixed(), 'wei', 'gwei').substr(0, 5))
      })
      return {
        labels: data.labels,
        datasets: [
          {
            label: 'Gas Price (GWEI)',
            backgroundColor: '#20c0c7',
            data: data.sData,
            borderColor: '#20c0c7',
            fill: false
          }
        ]
      }
    },

    /*Method to change description string: */
    changeDescription() {
      if (stateChanged && currentState == STATES.BEGIN) {
        description = DES.BEGIN + currentState
      } else if (stateChanged && currentState != STATES.BEGIN) {
        description = DES.OTHER + currentState
      }
    }
  },
  mounted: function() {}
})
</script>
