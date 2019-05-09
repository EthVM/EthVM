<template>
  <chart
    type="line"
    :data="chartData"
    :options="chartOptions"
    :redraw="redraw"
    :chart-title="newTitle"
    :chart-description="newDescription"
    unfilled="true"
    :footnotes="footnote"
    :live-chart="true"
    :error="error"
  />
</template>

<script lang="ts">
import { Events } from '@app/core/hub'
import { BlockMetrics } from '@app/core/models'
import Chart from '@app/modules/charts/components/Chart.vue'
import { EthValue } from '@app/core/models'
import { Footnote } from '@app/core/components/props'
import { Vue, Component } from 'vue-property-decorator'
import { BlockMetricPageExt } from '@app/core/api/apollo/extensions/block-metric-page.ext'
import { latestBlockMetrics, newBlockMetric } from '@app/modules/blocks/blocks.graphql'
import { BlockMetricExt } from '@app/core/api/apollo/extensions/block-metric.ext'
import BigNumber from 'bignumber.js'
import { Subscription } from 'rxjs'

const MAX_ITEMS = 10

class ChartData {
  constructor(public readonly labels: string[] = [], public readonly avgFees: number[] = [], public readonly avgPrice: number[] = []) {
    this.labels = labels
    this.avgFees = avgFees
    this.avgPrice = avgPrice
  }
}

@Component({
  components: {
    Chart
  },
  apollo: {
    metricsPage: {
      query: latestBlockMetrics,

      variables: {
        offset: 0,
        limit: MAX_ITEMS
      },

      update({ blockMetrics }) {
        if (blockMetrics) {
          this.error = '' // clear error
          return new BlockMetricPageExt(blockMetrics)
        }
        this.error = this.$i18n.t('message.no-data')
        return null
      },

      error({ graphQLErrors, networkError }) {
        if (networkError) {
          this.error = this.$i18n.t('message.no-data')
        } else {
          this.error = this.$i18n.t('message.err')
        }
      },

      subscribeToMore: {
        document: newBlockMetric,

        updateQuery: (previousResult, { subscriptionData }) => {
          const { blockMetrics } = previousResult
          const { newBlockMetric } = subscriptionData.data

          const items = Object.assign([], blockMetrics.items)

          // add one to the beginning and pop one from the end
          items.unshift(newBlockMetric)

          if (items.length > MAX_ITEMS) {
            items.pop()
          }

          // ensure order by block number desc
          items.sort((a, b) => {
            const numberA = a.number ? new BigNumber(a.number, 16) : new BigNumber(0)
            const numberB = b.number ? new BigNumber(b.number, 16) : new BigNumber(0)
            return numberB.minus(numberA).toNumber()
          })

          return {
            ...previousResult,
            blockMetrics: {
              ...blockMetrics,
              items
            }
          }
        }
      }
    }
  }
})
export default class ChartLiveTxFees extends Vue {
  /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */

  redraw = true
  error: string = ''
  metricsPage?: BlockMetricPageExt

  connectedSubscription?: Subscription

  /*
    ===================================================================================
      Lifecycle
    ===================================================================================
    */

  created() {
    this.connectedSubscription = this.$subscriptionState.subscribe(state => {
      switch (state) {
        case 'reconnected':
          this.$apollo.queries.metricsPage.refetch()
          break
      }
    })
  }

  destroyed() {
    if (this.connectedSubscription) {
      this.connectedSubscription.unsubscribe()
    }
  }

  /*
    ===================================================================================
      Methods
    ===================================================================================
    */

  toChartData(items: BlockMetricExt[]) {
    const numberLabel = this.$i18n.t('block.number')

    const labels: string[] = []
    const avgFees: number[] = []
    const avgPrice: number[] = []

    items.forEach(item => {
      labels.push(numberLabel + item.numberBN!.toString())
      avgFees.push(new EthValue(item.avgTxFeesBN!).toEth())
      avgPrice.push(new EthValue(item.avgGasPriceBN!).toGWei())
    })

    return new ChartData(labels, avgFees, avgPrice)
  }

  /*
    ===================================================================================
      Computed Values
    ===================================================================================
    */

  get chartData() {
    const items: BlockMetricExt[] = this.metricsPage ? this.metricsPage.items || [] : []
    const data = this.toChartData(items)

    return {
      labels: data.labels,
      datasets: [
        {
          label: this.$i18n.tc('tx.fee', 2),
          borderColor: '#40ce9c',
          backgroundColor: '#40ce9c',
          data: data.avgFees,
          yAxisID: 'y-axis-1',
          fill: false
        },
        {
          label: this.$i18n.t('gas.price'),
          borderColor: '#eea66b',
          backgroundColor: '#eea56b',
          data: data.avgPrice,
          yAxisID: 'y-axis-2',
          fill: false
        }
      ]
    }
  }

  get chartOptions() {
    return {
      title: {
        text: this.$i18n.t('charts.tx-costs.title'),
        lineHeight: 1
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            position: 'left',
            id: 'y-axis-1',
            ticks: {
              beginAtZero: true,
              callback: function(value) {
                const ranges = [
                  { divider: 1e9, suffix: 'B' },
                  { divider: 1e6, suffix: 'M' },
                  {
                    divider: 1e3,
                    suffix: 'k'
                  }
                ]

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
              display: true,
              labelString: this.$i18n.tc('tx.fee', 2)
            }
          },
          {
            id: 'y-axis-2',
            position: 'right',
            ticks: {
              beginAtZero: true,
              callback: function(value) {
                const ranges = [
                  { divider: 1e9, suffix: 'B' },
                  { divider: 1e6, suffix: 'M' },
                  {
                    divider: 1e3,
                    suffix: 'k'
                  }
                ]

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
              display: true,
              labelString: this.$i18n.t('gas.price')
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
  }

  get newTitle() {
    return this.$i18n.t('charts.tx-costs.title')
  }

  get newDescription() {
    return this.$i18n.t('charts.tx-costs.description')
  }

  get footnote(): Footnote[] {
    return [
      {
        color: 'txSuccess',
        text: `${this.$i18n.tc('tx.fee', 2)} (${this.$t('common.eth')})`,
        icon: 'fa fa-circle'
      },
      {
        color: 'txPen',
        text: `${this.$i18n.t('gas.price')} (${this.$t('common.gwei')})`,
        icon: 'fa fa-circle'
      }
    ]
  }
}
</script>
