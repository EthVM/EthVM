
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
import sEvents from '@app/configs/socketEvents.json'
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
  BEGIN: 'Average transaction fees in Ethereum blockchain since the ',
  OTHER: 'Average transaction fees in Ethereum blockchain in last '
}
let currentState = STATES.DAY
let stateChanged = false
let title = 'Tx Fees'
let description = ''
let MAX_ITEMS = 10
let lineOptions = {
  title: {
    text: 'Transaction Fees',
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
          labelString: 'Average Size (Bytes)'
        }
      }
    ],
    xAxes: [
      {
        type: 'time',
        distribution: 'series',
        ticks: {
          source: 'labels'
        }
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
  },
  beforeDestroy() {},
  computed: {
    initData() {
      let data = {
        labels: [],
        points: []
      }

      this.$socket.emit('getChartAvTxFee', 'LAST_7_DAYS', (err, result) => {
        if (!err && result) {
          console.log('result Average TxFee', result)
          result.forEach(function(block) {
            data.points.push(block.reduction)
            data.labels.push(block.group)
          })
        }
      })
      return {
        labels: data.labels,
        datasets: [
          {
            label: 'Average TxFee',
            borderColor: '#20c0c7',
            backgroundColor: '#20c0c7',
            data: data.points,
            yAxisID: 'y-axis-1',
            fill: false
          }
        ]
      }
    }
  },
  mounted: function() {}
})
</script>
