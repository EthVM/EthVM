<template>
  <app-chart
    type="line"
    :chart-id="id"
    :chart-title="title"
    :chart-description="description"
    :data="chartData"
    :options="chartOptions"
    :redraw="redraw"
    unfilled="true"
  />
</template>

<script lang="ts">
import AppChart from '@app/modules/charts/components/AppChart.vue'
import { Vue, Component } from 'vue-property-decorator'
import ethUnits from 'ethereumjs-units'
import { Events } from 'ethvm-common'

/* Time Variables: */
const STATES = {
  ALL: 'ALL',
  YEAR: 'YEAR',
  MONTH: 'MONTH',
  DAY: 'DAY'
}

const DES = {
  BEGIN: 'Average transactions fees per block in Ethereum blockchain since the begining.',
  OTHER: 'Average transactions fees per block in Ethereum blockchain in last '
}

@Component({
  components: {
    AppChart
  }
})
export default class ChartBlockSize extends Vue {
  id = 'tx_fees_history'
  title = 'Average Transactions Fees'
  redraw = false
  timeFrame = STATES.DAY
  chartOptions = {
    title: {
      text: 'Average Transactions Fees',
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
            labelString: 'Average Transactions Fees (GWEI)'
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
    }
  }

  /*Computed: */
  get chartData() {
    const newLabels = []
    const newPoints = []

    this.$socket.emit(Events.getAverageTxFeeStats, this.timeFrame, (err, result) => {
      if (!err && result) {
        result.forEach(block => {
          newPoints.push(block.reduction)
          newLabels.push(block.group)
        })
      }
    })
    return {
      labels: newLabels,
      datasets: [
        {
          label: 'Average Transactions Fees',
          borderColor: '#20c0c7',
          backgroundColor: '#20c0c7',
          data: newPoints,
          yAxisID: 'y-axis-1',
          fill: false
        }
      ]
    }
  }

  get description(): string {
    return this.timeFrame === STATES.ALL ? DES.BEGIN : DES.OTHER + this.timeFrame
  }
}
</script>
