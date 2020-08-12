<template>
    <div>
        <chart
            :chart-title="title"
            :chart-description="description"
            :datacollection="chartData"
            :chart-options="chartOptions"
            :footnotes="footnotes"
            :show-time-options="false"
        />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator'
import Chart from '@app/modules/charts/components/Chart.vue'
import { ChartDataMixin } from '@app/modules/charts/mixins/ChartDataMixin.mixin'
import { TimeseriesKey, DataPoint, ChartData, Dataset, ChartOptions, TimeseriesValueType } from '@app/modules/charts/models'
import { TimeseriesScale } from '@app/apollo/global/globalTypes'
import { getTimeseriesData_getTimeseriesData as GetTimeseriesDataType } from '@app/modules/charts/handlers/apolloTypes/getTimeseriesData'
import { getTimeseriesData, timeseriesEthAvg } from '@app/modules/charts/handlers/timeseriesData.graphql'
import { Footnote } from '@app/core/components/props'

const START = 10
const SCALE = TimeseriesScale.minutes
const VALUE_TYPE = TimeseriesValueType.GWEI
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
                        if (newItems.length > MAX_ITEMS) {
                            newItems.slice(1)
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
            update: data => data.getTimeseriesData.items,
            result({ data }) {
                this.gasMinDataSet = [...this.mapItemsToDataSet(data.getTimeseriesData.items, VALUE_TYPE)]
            }
        },
        dataGasMax: {
            query: getTimeseriesData,
            variables() {
                return this.getQueryVars(KEY_GAS_MAX, SCALE, START)
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
                        if (newItems.length > MAX_ITEMS) {
                            newItems.slice(1)
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
            update: data => data.getTimeseriesData.items,
            result({ data }) {
                this.gasMaxDataSet = [...this.mapItemsToDataSet(data.getTimeseriesData.items, VALUE_TYPE)]
            }
        },
        dataGasAvg: {
            query: getTimeseriesData,
            variables() {
                return this.getQueryVars(KEY_GAS_AVG, SCALE, START)
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
                        if (newItems.length > MAX_ITEMS) {
                            newItems.slice(1)
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
            update: data => data.getTimeseriesData.items,
            result({ data }) {
                this.gasAvgDataSet = [...this.mapItemsToDataSet(data.getTimeseriesData.items, VALUE_TYPE)]
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

    dataGasMin!: GetTimeseriesDataType
    dataGasMax!: GetTimeseriesDataType
    dataGasAvg!: GetTimeseriesDataType
    gasMinDataSet: DataPoint[] = []
    gasMaxDataSet: DataPoint[] = []
    gasAvgDataSet: DataPoint[] = []

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
                            beginAtZero: false,
                            source: 'auto',
                            callback: function (dataLabel, index) {
                                return index % 2 === 0 ? dataLabel : ''
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
