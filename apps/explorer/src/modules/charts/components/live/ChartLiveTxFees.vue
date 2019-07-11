<template>
  <chart
    type="line"
    :config="chartConfig"
    :initialData="chartData"
    :newData="latestData"
    :options="chartOptions"
    :redraw="redraw"
    :chart-title="newTitle"
    :chart-description="newDescription"
    unfilled="true"
    :footnotes="footnote"
    :live-chart="true"
    :error="error"
    :data-loading="loading"
  />
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
import { latestAvgGasPrices_blockMetricsTransaction, latestAvgGasPrices_blockMetricsTransaction_items } from '@app/core/api/apollo/types/latestAvgGasPrices'
import { latestAvgTxFees_blockMetricsTransactionFee, latestAvgTxFees_blockMetricsTransactionFee_items } from '@app/core/api/apollo/types/latestAvgTxFees'
import { newAvgGasPrice_newBlockMetricsTransaction } from "@app/core/api/apollo/types/newAvgGasPrice";
import { newAvgTxFee_newBlockMetricsTransactionFee } from "@app/core/api/apollo/types/newAvgTxFee";
import { ChartConfig, ChartData } from '@app/modules/charts/props'

const MAX_ITEMS = 10

@Component({
  components: {
    Chart
  },
  data() {
    return {
      syncing: undefined,
      avgGasPrices: undefined,
      avgTxFees: undefined,
      latestAvgGasPrice: undefined,
      latestAvgTxFee: undefined,
      latestData: undefined
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
    },

    $subscribe: {

      newAvgGasPrice: {
        query: newAvgGasPrice,
        result({ data }) {
          const self = this as any
          self.latestAvgGasPrice = data.newBlockMetricsTransaction
          self.updateLatestData()
        }
      },

      newAvgTxFee: {
        query: newAvgTxFee,
        result({ data }) {
          const self = this as any
          self.latestAvgTxFee = data.newBlockMetricsTransactionFee
          self.updateLatestData()
        }
      },
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
  latestAvgGasPrice?: newAvgGasPrice_newBlockMetricsTransaction
  latestAvgTxFee?: newAvgTxFee_newBlockMetricsTransactionFee
  latestData?: ChartData

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

  toChartDataItem(gasPrice: newAvgGasPrice_newBlockMetricsTransaction, txFee: newAvgTxFee_newBlockMetricsTransactionFee): ChartData {

    const numberLabel = this.$i18n.t('block.number')

    const data = [] as any[]
    data.push(gasPrice.avgGasPrice)
    data.push(txFee.avgTxFees)

    return {
      label: `${numberLabel} ${gasPrice.number}`,
      data
    }
  }

  updateLatestData() {

    const { latestAvgGasPrice, latestAvgTxFee } = this

    if (!(latestAvgGasPrice && latestAvgTxFee)) return

    if (latestAvgGasPrice.number !== latestAvgTxFee.number) return

    this.latestData = this.toChartDataItem(latestAvgGasPrice, latestAvgTxFee)
  }

  /*
    ===================================================================================
      Computed Values
    ===================================================================================
    */

  get loading(): boolean | undefined {
    return this.$apollo.queries.avgGasPrices.loading || this.$apollo.queries.avgTxFees.loading || this.syncing
  }

  get chartConfig(): ChartConfig {

    return {
      labels: [],
      datasets: [
        {
          label: this.$i18n.t('gas.price').toString(),
          borderColor: '#eea66b',
          backgroundColor: '#eea56b',
          data: [],
          yAxisID: 'y-axis-2',
          fill: false
        },
        {
          label: this.$i18n.tc('tx.fee', 2),
          borderColor: '#40ce9c',
          backgroundColor: '#40ce9c',
          data: [],
          yAxisID: 'y-axis-1',
          fill: false
        },
      ]
    }

  }

  get chartData(): ChartData[] {

    const { avgGasPrices, avgTxFees } = this

    if (!(avgGasPrices && avgTxFees)) {
      return []
    }

    if (!(avgGasPrices!.items.length && avgTxFees!.items.length)) {
      return []
    }

    const gasPriceItems = avgGasPrices!.items
    const txFeeItems = avgTxFees!.items

    const sortedItems: any[] = []

    if (gasPriceItems.length && txFeeItems.length) {
      const numbers = new Set<number>()
      gasPriceItems.forEach(item => numbers.add(item.number))
      txFeeItems.forEach(item => numbers.add(item.number))

      const numbersDesc = Array.from(numbers).sort((a, b) => b - a)

      const gasPricesByNumber = gasPriceItems.reduce((memo, next) => {
        memo.set(parseInt(next.number)!, next)
        return memo
      }, new Map<number, latestAvgGasPrices_blockMetricsTransaction_items>())

      const txFeesByNumber = txFeeItems.reduce((memo, next) => {
        memo.set(parseInt(next.number), next)
        return memo
      }, new Map<number, latestAvgTxFees_blockMetricsTransactionFee_items>())

      numbersDesc.forEach(number => {
        // for some reasons number is a string
        const avgGasPrice = gasPricesByNumber.get(+number) || 0
        const avgTxFee = txFeesByNumber.get(+number) || 0

        sortedItems.push({ avgGasPrice, avgTxFee })
      })
    }
    return sortedItems.map(item => this.toChartDataItem(item.avgGasPrice, item.avgTxFee))
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
