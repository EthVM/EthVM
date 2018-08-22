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

const title = 'Accounts Growth'
const description = ''
const MAX_ITEMS = 10
const lineOptions = {
  title: {
    text: 'Accounts Growth',
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
          labelString: 'Accounts Created'
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

      this.$socket.emit('getChartAccountsGrowth', 'LAST_7_DAYS', (err, result) => {
        if (!err && result) {
          console.log('result', result)
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
            label: 'Accounts Created',
            borderColor: '#2779ff',
            backgroundColor: '#2779ff',
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
