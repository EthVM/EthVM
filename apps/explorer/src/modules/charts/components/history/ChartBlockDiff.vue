<template>
  <app-chart
    type="line"
    :chart-title="title"
    :chart-description="description"
    :data="chartData"
    :options="chartOptions"
    :redraw="redraw"
    unfilled="true"
    @timeFrame = "setTimeFrame"
  >
  </app-chart>
</template>

<script lang="ts">
import AppChart from '@app/modules/charts/components/AppChart.vue'
import { Vue, Component } from 'vue-property-decorator'
import ethUnits from 'ethereumjs-units'
import { Events } from 'ethvm-common'
import id from '@app/modules/charts/helpers'

/* Time Variables: */
const STATES = ['ALL', 'DAY', 'MONTH', 'YEAR']

const DES = {
  BEGIN: 'Average block difficulty history in Ethereum blockchain since the begining.',
  OTHER: 'Average block difficulty history in Ethereum blockchain in last '
}

@Component({
  components: {
    AppChart
  }
})
export default class ChartBlockDiff extends Vue {
  ID = id.difficulty
  title = 'Average Block Difficulty'
  redraw = true
  timeFrame = 1
  chartOptions = {
    title: {
      text: 'Average Block Difficulty',
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
            labelString: 'Average Block Difficulty'
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
  newLabels = []
  newPoints = []

  /*Computed: */
  get chartData() {
    console.log("points", this.newPoints)

    return {
      labels: this.newLabels,
      datasets: [
        {
          label: 'Average Block Difficulty',
          borderColor: '#20c0c7',
          backgroundColor: '#20c0c7',
          data: this.newPoints,
          yAxisID: 'y-axis-1',
          fill: false
        }
      ]
    }
  }
  get description(): string {
    return this.timeFrame === 0? DES.BEGIN : DES.OTHER + STATES[this.timeFrame]
  }

   /*Methods: */
  setTimeFrame(_value: number): void {
    this.timeFrame = _value
    this.setData()
  }

  setData(): void {
    console.log(STATES[this.timeFrame] )
    this.$socket.emit(Events.getAvgTotalDifficultyStats, {"duration": STATES[this.timeFrame] }, (err, result) => {
      if (!err && result) {
        console.log("getting data", result)
        result.forEach(point =>{
          this.newPoints.push({
            x: point.date,
            y: point.value})
          this.newLabels.push(point.name)
        })
      }
    })
  }
}
</script>
