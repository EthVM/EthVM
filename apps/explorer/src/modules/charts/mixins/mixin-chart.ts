import { Component, Vue } from 'vue-property-decorator'

const DES = {
  BEGIN: ' in Ethereum blockchain since the begining ',
  OTHER: ' in Ethereum blockchain in last '
}

@Component
export class ChartMixin extends Vue {
  chartTitle = ''
  chartLabel = ''
  chartEvent
  redraw = true
  timeFrame = 1
  chartOptions = {
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
            labelString: this.chartLabel
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
  DATA = [
    { state: 'ALL', points: [], labels: [] },
    { state: 'WEEK', points: [], labels: [] },
    { state: 'MONTH', points: [], labels: [] },
    { state: 'YEAR', points: [], labels: [] }
  ]

  /*Computed: */
  get chartData() {
    return {
      labels: this.DATA[this.timeFrame].labels,
      datasets: [
        {
          label: this.chartLabel,
          borderColor: '#20c0c7',
          backgroundColor: '#20c0c7',
          data: this.DATA[this.timeFrame].points,
          yAxisID: 'y-axis-1',
          fill: false
        }
      ]
    }
  }

  /*Methods: */
  setTitle(_title: string): void {
    this.chartTitle = _title
  }

  setLabel(_label: string): void {
    this.chartLabel = _label
  }

  setEvent(_event): void {
    this.chartEvent = _event
  }

  setTimeFrame(_value: number): void {
    this.timeFrame = _value
    if (this.DATA[this.timeFrame].points.length === 0) {
      this.setData(_value)
    }
  }

  setData(_state: number): void {
    this.$socket.emit(this.chartEvent, { duration: this.DATA[_state].state }, (err, result) => {
      if (!err && result) {
        result.forEach(point => {
          this.DATA[_state].points.push(point.value)
          this.DATA[_state].labels.push(point.date)
        })
      }
    })
  }

  /*Computed: */
  get description(): string {
    return this.timeFrame === 0 ? this.chartTitle + DES.BEGIN : this.chartTitle + DES.OTHER + this.DATA[this.timeFrame].state
  }
}
