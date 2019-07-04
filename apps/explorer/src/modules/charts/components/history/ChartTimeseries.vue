<template>
  <chart
    type="line"
    :chart-title="title"
    :chart-description="description"
    :data="chartData"
    :options="chartOptions"
    :redraw="true"
    :data-loading="loading"
    :error="error"
    unfilled="true"
    @timeFrame="setTimeFrame"
  />
</template>

<script lang="ts">
import Chart from '@app/modules/charts/components/Chart.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { TimeBucket } from '@app/core/api/apollo/types/globalTypes'
import moment from 'moment'
import { ChartData } from '@app/modules/charts/props'
import BigNumber from 'bignumber.js'
import { EthValue } from '@app/core/models'

interface QueryOptions {
  start: moment.Moment
  end: moment.Moment
  bucket: TimeBucket
}

@Component({
  components: {
    Chart
  },
  data() {
    return {
      queryOptions: (this as any).calculateTimePeriod('week'),
      syncing: undefined
    }
  },
  apollo: {
    timeseries: {
      query() {
        return this.query
      },

      variables() {
        const { start, end, bucket } = this.queryOptions

        return {
          start: start.valueOf(), // convert to milliseconds since epoch
          end: end.valueOf(),
          bucket
        }
      },

      update({ blockMetricsTimeseries }) {
        return blockMetricsTimeseries
      },

      error({ graphQLErrors, networkError }) {
        const self = this

        if (graphQLErrors) {
          graphQLErrors.forEach(error => {
            switch (error.message) {
              case 'Currently syncing':
                // TODO handle this better with custom code or something
                self.syncing = true
                break
              default:
              // Do nothing
            }
          })
        }
        // TODO refine
        if (networkError) {
          this.error = this.$i18n.t('message.no-data')
        }
      }
    }
  }
})
export default class ChartTimeseries extends Vue {
  /*
    ===================================================================================
      Properties
    ===================================================================================
    */

  @Prop(String) title!: string
  @Prop(String) description!: string

  @Prop() query!: any
  @Prop({ type: String, default: () => 'any' }) valueType!: string

  queryOptions!: QueryOptions

  timeseries!: any[]

  error = ''
  syncing: undefined

  /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */

  chartOptions = {
    responsive: true,
    maintainAspectRatio: this.getRatio,
    scales: {
      yAxes: [
        {
          position: 'left',
          id: 'y-axis-1',
          ticks: {
            beginAtZero: true,
            callback: function(value) {
              const ranges = [{ divider: 1e9, suffix: 'B' }, { divider: 1e6, suffix: 'M' }, { divider: 1e3, suffix: 'k' }]

              function formatNumber(n) {
                for (let i = 0; i < ranges.length; i++) {
                  if (n >= ranges[i].divider) {
                    return (n / ranges[i].divider).toString() + ranges[i].suffix
                  }
                }
                return n
              }

              return formatNumber(value)
            }
          },
          gridLines: {
            color: 'rgba(0, 0, 0, 0)'
          },
          scaleLabel: {
            display: false,
            labelString: this.title
          }
        }
      ],
      xAxes: [
        {
          type: 'time',
          distribution: 'series',
          ticks: {
            source: 'auto'
          }
        }
      ]
    }
  }

  /*
    ===================================================================================
      Methods
    ===================================================================================
    */

  parseValue(value: any): any {
    if (!value) {
      return value
    }

    switch (this.valueType) {
      case 'any':
        return value
      case 'bignumber':
        return new BigNumber(value)
      case 'eth':
        return new EthValue(new BigNumber(value)).toEth()
      case 'gwei':
        return new EthValue(new BigNumber(value)).toGWei()
      default:
        throw new Error(`Unexpected valueType: ${this.valueType}`)
    }
  }

  setTimeFrame(value: number): void {
    let period

    switch (value) {
      case 0:
        period = 'week'
        break
      case 1:
        period = 'month'
        break
      case 2:
        period = 'all'
        break
      case 3:
        period = 'year'
        break
      default:
        throw new Error(`Unexpected timeframe: ${value}`)
    }

    this.queryOptions = this.calculateTimePeriod(period)
  }

  calculateTimePeriod(period: 'day' | 'week' | 'month' | 'year' | 'all'): QueryOptions {
    const start: moment.Moment = moment()
    let end: moment.Moment, bucket

    switch (period) {
      case 'day':
        bucket = TimeBucket.ONE_HOUR
        end = moment(start).subtract(1, 'day')
        break
      case 'week':
        bucket = TimeBucket.ONE_HOUR
        end = moment(start).subtract(1, 'week')
        break
      case 'month':
        bucket = TimeBucket.ONE_DAY
        end = moment(start).subtract(1, 'month')
        break
      case 'year':
        bucket = TimeBucket.ONE_WEEK
        end = moment(start).subtract(1, 'year')
        break
      case 'all':
        bucket = TimeBucket.ONE_WEEK
        end = moment('2000-01-01T00:00:00.000Z')
        break
      default:
        throw new Error(`Unexpected period: ${period}`)
    }

    return { start, end, bucket }
  }

  /*
    ===================================================================================
      Computed Values
    ===================================================================================
    */

  get getRatio(): boolean {
    const brkPoint = this.$vuetify.breakpoint.name
    return brkPoint !== 'xs'
  }

  get chartData(): ChartData {
    const { timeseries, description } = this

    const labels: any[] = []
    const data: any[] = []

    if (timeseries) {
      timeseries.forEach(t => {
        labels.push(new Date(t.timestamp))
        data.push(this.parseValue(t.value))
      })
    }

    return {
      labels: labels,
      datasets: [
        {
          label: description,
          borderColor: '#20c0c7',
          backgroundColor: '#20c0c7',
          data,
          yAxisID: 'y-axis-1',
          fill: false
        }
      ]
    }
  }

  get loading(): boolean | undefined {
    return this.$apollo.queries.timeseries.loading || this.syncing
  }
}
</script>
