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

/* Time Variables: */
const STATES = {
  BEGIN: 'beginning',
  YEAR: 'year',
  MONTH: 'month',
  DAY: 'day'
}

const DES = {
  BEGIN: 'Average gas limit history in Ethereum blockchain since the ',
  OTHER: 'Average gas limit history in Ethereum blockchain in last '
}

const currentState = STATES.DAY
const stateChanged = false
const title = 'Gas Limit'
const description = ''
const MAX_ITEMS = 10
const lineOptions = {
  title: {
    text: 'Average Gas Limit',
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
          labelString: 'Average Gas Limit (wei)'
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
      const data = {
        labels: [],
        points: []
      }

      this.$socket.emit('getChartGasLimit', 'LAST_7_DAYS', (err, result) => {
        if (!err && result) {
          console.log('result getChartGasLimit', result)
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
            label: 'Average gas Limit',
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
