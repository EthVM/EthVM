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
import sEvents from '@/configs/socketEvents.json'
import BN from 'bignumber.js'
import ethUnits from 'ethereumjs-units'

let title = 'Average Tx Costs'
let description = 'Average transaction fees and average gas price in the last 10 blocks'
let MAX_ITEMS = 10
let lineOptions = {
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
          let _tempD = _block.getStats()
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
      let data = {
        labels: [],
        avgFees: [],
        avgPrice: []
      }
      let latestBlocks = this.$store.getters.getBlocks.slice(0, MAX_ITEMS)
      latestBlocks.forEach(_block => {
        data.labels.unshift(_block.getNumber())
        let _tempD = _block.getStats()
        data.avgFees.unshift(ethUnits.convert(new BN(_tempD.avgTxFees).toFixed(), 'wei', 'eth').substr(0, 8))
        data.avgPrice.unshift(ethUnits.convert(new BN(_tempD.avgGasPrice).toFixed(), 'wei', 'gwei').substr(0, 5))
      })
      return {
        labels: data.labels,
        datasets: [
          {
            label: 'avg Tx Fees (ETH)',
            borderColor: '#2779ff',
            backgroundColor: '#2779ff',
            data: data.avgFees,
            yAxisID: 'y-axis-1',
            fill: false
          },
          {
            label: 'avg Gas Price (GWEI)',
            borderColor: '#f9967b',
            backgroundColor: '#f9967b',
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
