<template>
  <div></div>
<!--  <chart-->
<!--    type="line"-->
<!--    :data="chartData"-->
<!--    :options="chartOptions"-->
<!--    :redraw="redraw"-->
<!--    :chart-title="newTitle"-->
<!--    :chart-description="newDescription"-->
<!--    unfilled="true"-->
<!--    :footnotes="footnote"-->
<!--    :live-chart="true"-->
<!--    :error="error"-->
<!--    :data-loading="loading"-->
<!--  />-->
</template>

<script lang="ts">
import Chart from '@app/modules/charts/components/Chart.vue'
import { EthValue } from '@app/core/models'
import { Footnote } from '@app/core/components/props'
import { Vue, Component } from 'vue-property-decorator'
import { latestBlockMetrics, newBlockMetric } from '@app/modules/blocks/blocks.graphql'
import { latestAvgGasPrices, latestAvgTxFees, newAvgGasPrice, newAvgTxFee } from '@app/modules/charts/charts.graphql'
import BigNumber from 'bignumber.js'
import { Subscription } from 'rxjs'
import { latestAvgGasPrices_blockMetricsTransaction } from '@app/core/api/apollo/types/latestAvgGasPrices'
import { latestAvgTxFees_blockMetricsTransactionFee } from '@app/core/api/apollo/types/latestAvgTxFees'

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
  data() {
    return {
      syncing: undefined,
      avgGasPrices: undefined,
      avgTxFees: undefined
    }
  },
  apollo: {
    avgGasPrices: {
      query: latestAvgGasPrices,

      variables: {
        offset: 0,
        limit: MAX_ITEMS
      },

      update({ blockMetricsTransaction }) {
        if (blockMetricsTransaction) {
          this.error = '' // clear error
          return blockMetricsTransaction
        } else if (!this.syncing) {
          this.error = this.$i18n.t('message.no-data')
        }
        return null
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
                this.error = this.$i18n.t('message.err')
            }
          })
        } else if (networkError) {
          this.error = this.$i18n.t('message.no-data')
        } else {
          this.error = this.$i18n.t('message.err')
        }
      },

      subscribeToMore: {
        document: newAvgGasPrice,

        updateQuery: (previousResult, { subscriptionData }) => {
          const { blockMetricsTransaction } = previousResult
          const { newBlockMetricsTransaction } = subscriptionData.data

          const items = Object.assign([], blockMetricsTransaction.items)

          // add one to the beginning and pop one from the end

          items.unshift(newBlockMetricsTransaction)

          if (items.length > MAX_ITEMS) {
            items.pop()
          }

          // ensure order by block number desc
          items.sort((a, b) => {
            const numberA = a.number ? new BigNumber(a.number, 10) : new BigNumber(0)
            const numberB = b.number ? new BigNumber(b.number, 10) : new BigNumber(0)
            return numberB.minus(numberA).toNumber()
          })

          return {
            ...previousResult,
            blockMetricsTransaction: {
              ...blockMetricsTransaction,
              items
            }
          }
        }
      }
    },

    avgTxFees: {
      query: latestAvgTxFees,

      variables: {
        offset: 0,
        limit: MAX_ITEMS
      },

      update({ blockMetricsTransactionFee }) {
        if (blockMetricsTransactionFee) {
          this.error = '' // clear error
          return blockMetricsTransactionFee
        } else if (!this.syncing) {
          this.error = this.$i18n.t('message.no-data')
        }
        return null
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
                this.error = this.$i18n.t('message.err')
            }
          })
        } else if (networkError) {
          this.error = this.$i18n.t('message.no-data')
        } else {
          this.error = this.$i18n.t('message.err')
        }
      },

      subscribeToMore: {
        document: newAvgTxFee,

        updateQuery: (previousResult, { subscriptionData }) => {
          const { blockMetricsTransactionFee } = previousResult
          const { newBlockMetricsTransactionFee } = subscriptionData.data

          const items = Object.assign([], blockMetricsTransactionFee.items)

          // add one to the beginning and pop one from the end

          items.unshift(newBlockMetricsTransactionFee)

          if (items.length > MAX_ITEMS) {
            items.pop()
          }

          // ensure order by block number desc
          items.sort((a, b) => {
            const numberA = a.number ? new BigNumber(a.number, 10) : new BigNumber(0)
            const numberB = b.number ? new BigNumber(b.number, 10) : new BigNumber(0)
            return numberB.minus(numberA).toNumber()
          })

          return {
            ...previousResult,
            blockMetricsTransactionFee: {
              ...blockMetricsTransactionFee,
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

  redraw = false
  error: string = ''
  syncing?: boolean

  avgGasPrices?: latestAvgGasPrices_blockMetricsTransaction
  avgTxFees?: latestAvgTxFees_blockMetricsTransactionFee

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
          this.$apollo.queries.avgGasPrices.refetch()
          this.$apollo.queries.avgTxFees.refetch()
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

  toChartData(avgGasPrices?: latestAvgGasPrices_blockMetricsTransaction, avgTxFees?: latestAvgTxFees_blockMetricsTransactionFee) {
    const numberLabel = this.$i18n.t('block.number')

    const labels: string[] = []
    const avgFees: number[] = []
    const avgPrice: number[] = []

    if (!(avgGasPrices && avgTxFees)) {
      return new ChartData(labels, avgFees, avgPrice)
    }

    if (!(avgGasPrices!.items.length && avgTxFees!.items.length)) {
      return new ChartData(labels, avgFees, avgPrice)
    }

    const gasPriceItems = avgGasPrices!.items
    const txFeeItems = avgTxFees!.items

    if (gasPriceItems.length && txFeeItems.length) {
      const numbers = new Set<number>()
      gasPriceItems.forEach(item => numbers.add(item.number))
      txFeeItems.forEach(item => numbers.add(item.number))

      const numbersDesc = Array.from(numbers).sort((a, b) => b - a)

      const gasPricesByNumber = gasPriceItems.reduce((memo, next) => {
        memo.set(parseInt(next.number)!, new EthValue(next.avgGasPrice!).toGWei())
        return memo
      }, new Map<number, number>())

      const txFeesByNumber = txFeeItems.reduce((memo, next) => {
        memo.set(parseInt(next.number), new EthValue(next.avgTxFees!).toEth())
        return memo
      }, new Map<number, number>())

      numbersDesc.forEach(number => {
        // for some reasons number is a string
        const avgGasPrice = gasPricesByNumber.get(+number) || 0
        const avgTxFee = txFeesByNumber.get(+number) || 0

        labels.push(numberLabel + number.toString())
        avgPrice.push(avgGasPrice)
        avgFees.push(avgTxFee)
      })
    }

    return new ChartData(labels, avgFees, avgPrice)
  }

  /*
    ===================================================================================
      Computed Values
    ===================================================================================
    */

  get loading(): boolean | undefined {
    return this.$apollo.queries.avgGasPrices.loading || this.$apollo.queries.avgTxFees.loading || this.syncing
  }

  get chartData() {
    const data = this.toChartData(this.avgGasPrices, this.avgTxFees)

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
