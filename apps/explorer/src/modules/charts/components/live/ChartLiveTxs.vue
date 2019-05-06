<template>
  <chart
    type="bar"
    :data="chartData"
    :options="chartOptions"
    :chart-title="newTitle"
    :chart-description="newDescription"
    :redraw="true"
    :footnotes="footnote"
    :live-chart="true"
  />
</template>

<script lang="ts">
import Chart from '@app/modules/charts/components/Chart.vue'
import { Vue, Component } from 'vue-property-decorator'
import { Footnote } from '@app/core/components/props'
import { latestBlocks, newBlock } from '@app/modules/blocks/components/blocks.graphql'
import { BlockSummaryExt } from '@app/core/api/apollo/extensions/block-summary.ext'
import BigNumber from 'bignumber.js'
import { BlockSummaryPageExt } from '@app/core/api/apollo/extensions/block-summary-page.ext'

const MAX_ITEMS = 10

class ChartData {
  constructor(
    public readonly labels: string[] = [],
    public readonly sTxs: number[] = [],
    public readonly fTxs: number[] = [],
    public readonly pTxs: number[] = []
  ) {
    this.labels = labels
    this.sTxs = sTxs
    this.fTxs = fTxs
    this.pTxs = pTxs
  }
}

@Component({
  components: {
    Chart
  },
  apollo: {
    blockPage: {
      query: latestBlocks,

      variables: {
        offset: 0,
        limit: MAX_ITEMS
      },

      update({ blockSummaries }) {
        return new BlockSummaryPageExt(blockSummaries)
      },

      subscribeToMore: {
        document: newBlock,

        updateQuery: (previousResult, { subscriptionData }) => {
          const { blockSummaries } = previousResult
          const { newBlock } = subscriptionData.data

          const items = Object.assign([], blockSummaries.items)

          // add to the beginning of the array
          items.unshift(newBlock)

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
            blockSummaries: {
              ...blockSummaries,
              items
            }
          }
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

  blockPage?: BlockSummaryPageExt

  /*
    ===================================================================================
      Lifecycle
    ===================================================================================
    */

  /*
    ===================================================================================
      Methods
    ===================================================================================
    */

  toChartData(items: (BlockSummaryExt | null)[]) {
    const numberLabel = this.$i18n.t('block.number')

    const labels: string[] = []
    const sTxs: number[] = []
    const fTxs: number[] = []
    const pTxs: number[] = []

    items.forEach(item => {
      labels.push(numberLabel + item!.numberBN!.toString())
      sTxs.push(item!.numSuccessfulTxsBN!.toNumber())
      fTxs.push(item!.numFailedTxsBN!.toNumber())
      // TODO add pending txs
      pTxs.push(0)
    })

    return new ChartData(labels, sTxs, fTxs, pTxs)
  }

  /*
    ===================================================================================
      Computed Values
    ===================================================================================
    */

  get chartData() {
    const items: (BlockSummaryExt | null)[] = this.blockPage ? this.blockPage.items || [] : []
    const data = this.toChartData(items)

    return {
      labels: data.labels,
      datasets: [
        {
          label: 'Pending',
          backgroundColor: '#eea66b',
          borderColor: '#eea66b',
          data: data.pTxs,
          type: 'line',
          fill: false,
          yAxisID: 'y-axis-2'
        },
        {
          label: this.$i18n.t('common.success'),
          backgroundColor: '#40ce9c',
          data: data.sTxs,
          yAxisID: 'y-axis-1'
        },
        {
          label: this.$i18n.t('common.fail'),
          backgroundColor: '#fe136c',
          data: data.fTxs,
          yAxisID: 'y-axis-1'
        }
      ]
    }
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
      },
      {
        color: 'txPen',
        text: this.$i18n.t('common.pending'),
        icon: 'fa fa-circle'
      }
    ]
  }

  get newTitle() {
    return this.$i18n.t('charts.tx-summary.title')
  }

  get newDescription() {
    return this.$i18n.t('charts.tx-summary.description')
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
              display: true,
              labelString: this.$i18n.t('charts.tx-summary.label.success-fail')
            }
          },
          {
            id: 'y-axis-2',
            position: 'right',
            stacked: false,
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
              display: true,
              labelString: this.$t('charts.tx-summary.label.pen')
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
