<template>
    <div>
        <chart
            :chart-title="title"
            :chart-description="description"
            :datacollection="chartData"
            :chart-options="chartOptions"
            :footnotes="footnotes"
            :show-time-options="false"
            :is-loading-data="loading"
        />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator'
import Chart from '@app/modules/charts/components/Chart.vue'
import { ChartDataMixin } from '@app/modules/charts/mixins/ChartDataMixin.mixin'
import { TimeseriesKey, DataPoint, ChartData, Dataset, ChartOptions, TimeseriesValue } from '@app/modules/charts/models'
import { TimeseriesScale } from '@app/apollo/global/globalTypes'
import {
    getTimeseriesData_getTimeseriesData as GetTimeseriesDataType,
    getTimeseriesData_getTimeseriesData_items as TimeseriesDataItem
} from '@app/modules/charts/handlers/apolloTypes/getTimeseriesData'
import { getTimeseriesData, timeseriesEthAvg } from '@app/modules/charts/handlers/timeseriesData.graphql'
import { Footnote } from '@app/core/components/props'

const START = 10
const SCALE = TimeseriesScale.minutes
const VALUE_TYPE = TimeseriesValue.NUMBER
const KEY_TX_PEN = TimeseriesKey.PENDING_TX_COUNT_TOTAL
const KEY_TX_TOTAL = TimeseriesKey.TX_COUNT_TOTAL
const MAX_ITEMS = 10

@Component({
    components: {
        Chart
    },
    apollo: {
        dataTxTotal: {
            query: getTimeseriesData,
            variables() {
                return this.getQueryVars(KEY_TX_TOTAL, SCALE, START)
            },
            skip() {
                return this.loadingOffset
            },
            subscribeToMore: {
                document: timeseriesEthAvg,
                variables() {
                    return this.getSubscriptionVars(KEY_TX_TOTAL, SCALE)
                },
                updateQuery(previousResult, { subscriptionData }) {
                    if (previousResult && subscriptionData.data.timeseriesEvent) {
                        const prevItems = previousResult.getTimeseriesData.items
                        const newItem = subscriptionData.data.timeseriesEvent.item
                        if (!newItem) {
                            return previousResult
                        }
                        const newItems = this.addSubscriptionItem(newItem, prevItems, MAX_ITEMS)
                        while (newItems.length > MAX_ITEMS) {
                            newItems.shift()
                        }
                        return {
                            getTimeseriesData: {
                                __typename: previousResult.getTimeseriesData.__typename,
                                items: [...newItems],
                                nextKey: previousResult.getTimeseriesData.nextKey
                            }
                        }
                    }
                }
            },
            update: data => (data.getTimeseriesData ? data.getTimeseriesData.items : null),
            result({ data }) {
                if (data && data.getTimeseriesData && data.getTimeseriesData.items && data.getTimeseriesData.items.length > 0) {
                    this.txTotalDataSet = [...this.mapItemsToDataSet(data.getTimeseriesData.items, VALUE_TYPE)]
                }
            },
            error(error) {
                this.hasErrorTxTotal = true
            }
        },
        dataTxPen: {
            query: getTimeseriesData,
            variables() {
                return this.getQueryVars(KEY_TX_PEN, SCALE, START)
            },
            skip() {
                return this.loadingOffset
            },
            subscribeToMore: {
                document: timeseriesEthAvg,
                variables() {
                    return this.getSubscriptionVars(KEY_TX_PEN, SCALE)
                },
                updateQuery(previousResult, { subscriptionData }) {
                    if (previousResult && subscriptionData.data.timeseriesEvent) {
                        const prevItems = previousResult.getTimeseriesData.items
                        const newItem = subscriptionData.data.timeseriesEvent.item
                        if (!newItem) {
                            return previousResult
                        }
                        const newItems = this.addSubscriptionItem(newItem, prevItems, MAX_ITEMS)
                        while (newItems.length > MAX_ITEMS) {
                            newItems.shift()
                        }
                        return {
                            getTimeseriesData: {
                                __typename: previousResult.getTimeseriesData.__typename,
                                items: [...newItems],
                                nextKey: previousResult.getTimeseriesData.nextKey
                            }
                        }
                    }
                }
            },
            update: data => (data.getTimeseriesData ? data.getTimeseriesData.items : null),
            result({ data }) {
                if (data && data.getTimeseriesData && data.getTimeseriesData.items && data.getTimeseriesData.items.length > 0) {
                    this.txPenDataSet = [...this.mapItemsToDataSet(data.getTimeseriesData.items, VALUE_TYPE)]
                }
            },
            error(error) {
                this.hasErrorTxPen = true
            }
        }
    }
})
export default class HomeTxChart extends Mixins(ChartDataMixin) {
    /*
    ===================================================================================
     Initial Data
    ===================================================================================
    */

    dataTxTotal!: (TimeseriesDataItem | null)[]
    dataTxPen!: (TimeseriesDataItem | null)[]
    txTotalDataSet: DataPoint[] = []
    txPenDataSet: DataPoint[] = []
    hasErrorTxTotal = false
    hasErrorTxPen = false

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get title(): string {
        return `${this.$t('charts.tx-summary.title')}`
    }
    get description(): string {
        return `${this.$t('charts.tx-summary.description')}`
    }

    /**
     * Array of Total Txs points aligned with the pending timestamp
     * 0 values are set when data point was not found in the dataTotalTxs, due to data
     * not being avaialble in the DB.
     * Futher results are mapped to the teh DataPoint Type
     * @return
     * - DataPoint[] if dataTotalTxs and dataTxPen queries returned results
     * - null otherwise
     */
    get totalTxs(): DataPoint[] | null {
        if (this.txTotalDataSet.length > 0 && this.txPenDataSet.length > 0) {
            const _items = this.dataTxPen.map((txPen, index) => {
                if (txPen) {
                    const point = this.dataTxTotal.find(element => {
                        if (element) {
                            return element.timestamp === txPen.timestamp
                        }
                        return undefined
                    })
                    return {
                        __typename: txPen.__typename,
                        timestamp: txPen.timestamp,
                        value: point ? point.value : '0'
                    }
                }
                return null
            })

            return this.mapItemsToDataSet(_items, VALUE_TYPE)
        }
        return null
    }

    get chartData(): ChartData | null {
        const _datasets: Dataset[] = []
        if (this.totalTxs) {
            _datasets.push({
                data: this.totalTxs,
                label: `${this.$t('charts.tx-summary.label.total')}`,
                borderColor: '#00b173',
                backgroundColor: '#00b173',
                borderWidth: 2,
                fill: false
            })
        }
        if (this.txPenDataSet) {
            _datasets.push({
                data: this.txPenDataSet,
                label: `${this.$t('charts.tx-summary.label.pen')}`,
                borderColor: '#8391a8',
                backgroundColor: '#8391a8',
                borderWidth: 2,
                fill: false
            })
        }

        if (_datasets.length > 0) {
            return {
                datasets: _datasets
            }
        }
        return null
    }

    get chartOptions(): ChartOptions {
        return {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [
                    {
                        type: 'time',
                        display: true,
                        time: {
                            unit: 'minute',
                            displayFormats: {
                                minute: 'h:mm a'
                            },
                            stepSize: 1
                        },
                        scaleLabel: {
                            display: false,
                            labelString: 'Time'
                        },
                        ticks: {
                            beginAtZero: false,
                            source: 'auto',
                            callback: function (dataLabel, index) {
                                return index % 2 === 0 ? dataLabel : ''
                            }
                        }
                    }
                ],
                yAxes: [
                    {
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: `${this.$t('charts.tx-summary.label-y')}`
                        },
                        ticks: {
                            beginAtZero: true,
                            source: 'data',
                            callback: function (value) {
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
                        }
                    }
                ]
            }
        }
    }
    get footnotes(): Footnote[] {
        return [
            {
                color: 'info',
                text: `${this.$t('charts.tx-summary.label.pen')}`,
                icon: 'fa fa-circle'
            },
            {
                color: 'txSuccess',
                text: `${this.$t('charts.tx-summary.label.total')}`,
                icon: 'fa fa-circle'
            }
        ]
    }

    get loading(): boolean {
        const loadingQueries = this.$apollo.queries.dataTxTotal.loading || this.$apollo.queries.dataTxPen.loading
        const hasError = this.hasErrorTxTotal && this.hasErrorTxPen
        return this.loadingOffset || loadingQueries || hasError
    }
}
</script>
<style scoped lang="css">
.tx-filter-select-container {
    border: solid 1px #efefef;
    padding-top: 1px;
}
.tx-status {
    min-width: 60px;
}
</style>
