import { Component, Vue } from 'vue-property-decorator'

@Component
export class ChartMixin extends Vue {
  chartTitle = ''
  chartLabel = ''
  chartEvent = null
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

  /* Methods: */
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

  /* Computed: */
  get description(): string {
    return this.timeFrame === 0
      ? this.$i18n.t('charts.avg') + this.chartTitle + this.$i18n.t('charts.captions.all')
      : this.$i18n.t('charts.avg') + this.chartTitle + this.$i18n.t('charts.captions.other') + this.DATA[this.timeFrame].cap
  }

  get DATA() {
    return [
      { state: 'ALL', cap: this.$i18n.t('charts.states.all'), points: [], labels: [] },
      { state: 'WEEK', cap: this.$i18n.t('charts.states.week'), points: [], labels: [] },
      { state: 'MONTH', cap: this.$i18n.t('charts.states.month'), points: [], labels: [] },
      { state: 'YEAR', cap: this.$i18n.t('charts.states.year'), points: [], labels: [] }
    ]
  }
}
