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
const VALUE_TYPE = TimeseriesValue.GWEI
const KEY_GAS_MIN = TimeseriesKey.GAS_PRICE_MIN
const KEY_GAS_MAX = TimeseriesKey.GAS_PRICE_MAX
const KEY_GAS_AVG = TimeseriesKey.GAS_PRICE_AVG
const MAX_ITEMS = 10

@Component({
    components: {
        Chart
    },
    apollo: {
        dataGasMin: {
            query: getTimeseriesData,
            variables() {
                return this.getQueryVars(KEY_GAS_MIN, SCALE, START)
            },
            skip() {
                return this.loadingOffset
            },
            subscribeToMore: {
                document: timeseriesEthAvg,
                variables() {
                    return this.getSubscriptionVars(KEY_GAS_MIN, SCALE)
                },
                updateQuery(previousResult, { subscriptionData }) {
                    if (previousResult && subscriptionData.data.timeseriesEvent) {
                        const prevItems = previousResult.getTimeseriesData.items
                        const newItem = subscriptionData.data.timeseriesEvent.item
                        if (!newItem) {
                            return previousResult
                        }
                        const newItems = this.addSubscriptionItem(newItem, prevItems)
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
                    this.gasMinDataSet = [...this.mapItemsToDataSet(data.getTimeseriesData.items, VALUE_TYPE)]
                }
            },
            error(error) {
                this.hasErrorGasMin = true
            }
        },
        dataGasMax: {
            query: getTimeseriesData,
            variables() {
                return this.getQueryVars(KEY_GAS_MAX, SCALE, START)
            },
            skip() {
                return this.loadingOffset
            },
            subscribeToMore: {
                document: timeseriesEthAvg,
                variables() {
                    return this.getSubscriptionVars(KEY_GAS_MAX, SCALE)
                },
                updateQuery(previousResult, { subscriptionData }) {
                    if (previousResult && subscriptionData.data.timeseriesEvent) {
                        const prevItems = previousResult.getTimeseriesData.items
                        const newItem = subscriptionData.data.timeseriesEvent.item
                        if (!newItem) {
                            return previousResult
                        }
                        const newItems = this.addSubscriptionItem(newItem, prevItems)
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
                    this.gasMaxDataSet = [...this.mapItemsToDataSet(data.getTimeseriesData.items, VALUE_TYPE)]
                }
            },
            error(error) {
                this.hasErrorGasMax = true
            }
        },
        dataGasAvg: {
            query: getTimeseriesData,
            variables() {
                return this.getQueryVars(KEY_GAS_AVG, SCALE, START)
            },
            skip() {
                return this.loadingOffset
            },
            subscribeToMore: {
                document: timeseriesEthAvg,
                variables() {
                    return this.getSubscriptionVars(KEY_GAS_AVG, SCALE)
                },
                updateQuery(previousResult, { subscriptionData }) {
                    if (previousResult && subscriptionData.data.timeseriesEvent) {
                        const prevItems = previousResult.getTimeseriesData.items
                        const newItem = subscriptionData.data.timeseriesEvent.item
                        if (!newItem) {
                            return previousResult
                        }
                        const newItems = this.addSubscriptionItem(newItem, prevItems)
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
                    this.gasAvgDataSet = [...this.mapItemsToDataSet(data.getTimeseriesData.items, VALUE_TYPE)]
                }
            },
            error(error) {
                this.hasErrorGasAvg = true
            }
        }
    }
})
export default class HomeGasPriceChart extends Mixins(ChartDataMixin) {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(Number) maxItems!: number

    /*
    ===================================================================================
     Initial Data
    ===================================================================================
    */

    dataGasMin!: TimeseriesDataItem
    dataGasMax!: TimeseriesDataItem
    dataGasAvg!: TimeseriesDataItem
    gasMinDataSet: DataPoint[] = []
    gasMaxDataSet: DataPoint[] = []
    gasAvgDataSet: DataPoint[] = []

    hasErrorGasMin = false
    hasErrorGasMax = false
    hasErrorGasAvg = false

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get title(): string {
        return `${this.$t('charts.gas-price-live.title')}`
    }
    get description(): string {
        return `${this.$t('charts.gas-price-live.description')}`
    }

    get chartData(): ChartData | null {
        const _datasets: Dataset[] = []
        if (this.gasMinDataSet) {
            _datasets.push({
                data: this.gasMinDataSet,
                label: `${this.$t('charts.gas-price-live.label.min')}`,
                borderColor: '#8391a8',
                backgroundColor: '#8391a8',
                borderWidth: 2,
                fill: false
            })
        }
        if (this.gasAvgDataSet) {
            _datasets.push({
                data: this.gasAvgDataSet,
                label: `${this.$t('charts.gas-price-live.label.avg')}`,
                borderColor: '#3d55a5',
                backgroundColor: '#3d55a5',
                borderWidth: 2,
                fill: false
            })
        }
        if (this.gasMaxDataSet) {
            _datasets.push({
                data: this.gasMaxDataSet,
                label: `${this.$t('charts.gas-price-live.label.max')}`,
                borderColor: '#fed9a1',
                backgroundColor: '#fed9a1',
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
                            labelString: `${this.$t('charts.gas-price-live.label-y')}`
                        },
                        ticks: {
                            beginAtZero: true,
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
                color: 'primary',
                text: `${this.$t('charts.gas-price-live.footenotes.avg')}`,
                icon: 'fa fa-circle'
            },
            {
                color: 'info',
                text: `${this.$t('charts.gas-price-live.footenotes.min')}`,
                icon: 'fa fa-circle'
            },
            {
                color: 'txPen',
                text: `${this.$t('charts.gas-price-live.footenotes.max')}`,
                icon: 'fa fa-circle'
            }
        ]
    }
    get loading(): boolean {
        const loadingQueries = this.$apollo.queries.dataGasMin.loading || this.$apollo.queries.dataGasMax.loading || this.$apollo.queries.dataGasAvg.loading
        const hasError = this.hasErrorGasMin && this.hasErrorGasMax && this.hasErrorGasAvg
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
