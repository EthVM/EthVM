<template>
  <chart
    type="bar"
    :config="chartConfig"
    :initial-data="chartData"
    :new-data="toChartDataItem(latestBlock)"
    :options="chartOptions"
    :chart-title="newTitle"
    :chart-description="newDescription"
    :redraw="false"
    :footnotes="footnote"
    :live-chart="true"
    :error="error"
    :data-loading="loading"
  />
</template>

<script lang="ts">
import Chart from '@app/modules/charts/components/Chart.vue'
import { Vue, Component } from 'vue-property-decorator'
import { Footnote } from '@app/core/components/props'
import { latestBlocks, newBlock } from '@app/modules/blocks/blocks.graphql'
import { BlockSummaryPageExt, BlockSummaryPageExt_items } from '@app/core/api/apollo/extensions/block-summary-page.ext'
import { Subscription } from 'rxjs'
import { ChartConfig, ChartData } from '@app/modules/charts/props'

const MAX_ITEMS = 10

@Component({
  components: {
    Chart
  },
  data() {
    return {
      syncing: undefined,
      latestBlock: undefined
    }
  },
  apollo: {
    blockPage: {
      query: latestBlocks,

      variables: {
        offset: 0,
        limit: MAX_ITEMS
      },

      update({ blockSummaries }) {
        if (blockSummaries) {
          this.error = '' // clear any previous error
          blockSummaries.items.sort((a, b) => a.number - b.number)
          return new BlockSummaryPageExt(blockSummaries)
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
      }
    },
    $subscribe: {
      latestBlock: {
        query: newBlock,
        result({ data }) {
          const self = this as any
          self.latestBlock = new BlockSummaryPageExt_items(data.newBlock)
        }
      }
    }
  }
})
export default class ChartLiveTxs extends Vue {
  /*
        ===================================================================================
          Initial Data
        ===================================================================================
        */

  error: string = ''
  syncing?: boolean

  blockPage?: BlockSummaryPageExt

  newBlock?: BlockSummaryPageExt_items

  latestBlock?: ChartData

  connectedSubscription?: Subscription

  /*
        ===================================================================================
          Lifecycle
        ===================================================================================
        */

  created() {
    this.connectedSubscription = this.$subscriptionState.subscribe(state => {
      if (state === 'reconnected') {
        this.$apollo.queries.blockPage.refetch()
      }
    })
  }

  mounted() {
    // Ensure query is refetched each time the component is mounted to keep data updated
    this.$apollo.queries.blockPage.refetch()
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

  toChartDataItem(raw?: BlockSummaryPageExt_items): ChartData | undefined {
    if (!raw) {
      return undefined
    }

    const numberLabel = this.$i18n.t('block.number')

    const data = [] as any[]
    data.push(raw.numSuccessfulTxsBN!.toNumber())
    data.push(raw.numFailedTxsBN!.toNumber())

    return {
      label: `${numberLabel} ${raw!.numberBN!.toString()}`,
      data
    }
  }

  /*
        ===================================================================================
          Computed Values
        ===================================================================================
        */

  get loading(): boolean | undefined {
    return this.$apollo.queries.blockPage.loading || this.syncing
  }

  get chartConfig(): ChartConfig {
    return {
      labels: [],
      datasets: [
        {
          label: this.$i18n.t('common.success').toString(),
          backgroundColor: '#40ce9c',
          data: [],
          yAxisID: 'y-axis-1'
        },
        {
          label: this.$i18n.t('common.fail').toString(),
          backgroundColor: '#fe136c',
          data: [],
          yAxisID: 'y-axis-2'
        }
        // {
        //   label: 'Pending',
        //   backgroundColor: '#eea66b',
        //   borderColor: '#eea66b',
        //   data: [],
        //   type: 'line',
        //   fill: false,
        //   yAxisID: 'y-axis-2'
        // }
      ]
    }
  }

  get chartData(): ChartData[] {
    const items = this.blockPage ? this.blockPage.items : []
    return items.map(item => this.toChartDataItem(item)!)
  }

  get footnote(): Footnote[] {
    return [
      {
        color: 'txSuccess',
        text: this.$i18n.t('common.success'),
        icon: 'fa fa-circle'
      },
      {
        color: 'txFail',
        text: this.$i18n.t('common.fail'),
        icon: 'fa fa-circle'
      }
      // {
      //   color: 'txPen',
      //   text: this.$i18n.t('common.pending'),
      //   icon: 'fa fa-circle'
      // }
    ]
  }

  get newTitle() {
    return this.$i18n.t('charts.tx-summary.title')
  }

  get newDescription() {
    return this.$i18n.t('charts.tx-summary.description-no-pending')
  }

  get chartOptions() {
    return {
      title: {
        text: this.$i18n.t('charts.tx-summary.title')
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            stacked: false,
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
              labelString: this.$i18n.t('charts.tx-success.title')
            }
          },
          {
            id: 'y-axis-2',
            position: 'right',
            stacked: false,
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
              labelString: this.$t('charts.tx-fail.title')
            }
          }
        ],
        xAxes: [
          {
            stacked: false,
            display: false
          }
        ]
      }
    }
  }
}
</script>
