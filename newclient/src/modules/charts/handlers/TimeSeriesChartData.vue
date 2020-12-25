<template>
    <div>
        <chart
            :chart-title="title"
            :chart-description="description"
            :datacollection="chartData"
            :chart-options="chartOptions"
            :is-pending="isPending"
            :is-loading-data="loading"
            @timeFrame="setTimeFrame"
        />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator'
import Chart from '@app/modules/charts/components/Chart.vue'
import { ChartDataMixin } from '@app/modules/charts/mixins/ChartDataMixin.mixin'
import {
    TimeseriesKey,
    DataPoint,
    ChartData,
    Dataset,
    ChartOptions,
    TimeseriesValue,
    TimeseriesValueKey,
    TimeOptions,
    ComponentDataInterface,
    ChartRouteKey
} from '@app/modules/charts/models'
import { TimeseriesScale } from '@app/apollo/global/globalTypes'
import { getTimeseriesData_getTimeseriesData_items as GetTimeseriesDataType } from '@app/modules/charts/handlers/apolloTypes/getTimeseriesData'
import { getTimeseriesData, timeseriesEthAvg } from '@app/modules/charts/handlers/timeseriesData.graphql'
import { Footnote } from '@app/core/components/props'

/**
 * Defualt values time frame options
 * 0 === Last Hour, return 60 data points for the last hour in minutes.
 * 1 === Last 24 hours, return 24 data points for the last day, 1 point per hour
 * 2 === Last Week, return 168 data points for the last week , 1 point per hours
 * 3 === Last Month, return 30 data points for the last week, 1 point per day
 * 4 === Last 6th Months, return 180 data points for the last 6 months, 1 point per day
 * 5 === Last Year, returns 365 data points for the last year, 1 point per day
 * NOTE: missing all functionality.
 */

const DEFAULT_DATA: ComponentDataInterface = {
    0: {
        id: 'hour',
        scale: TimeseriesScale.minutes,
        start: 60,
        max_items: 60,
        timeOptions: {
            unit: 'minute',
            displayFormats: {
                minute: 'h:mm a'
            },
            stepSize: 1
        }
    },
    1: {
        id: 'day',
        scale: TimeseriesScale.hours,
        start: 24,
        max_items: 24,
        timeOptions: {
            unit: 'hour',
            displayFormats: {
                minute: 'h:mm a'
            },
            stepSize: 1
        }
    },
    2: {
        id: 'week',
        scale: TimeseriesScale.hours,
        start: 168,
        max_items: 168,
        timeOptions: {
            unit: 'hour',
            displayFormats: {
                day: 'ddd, h:mm a'
            },
            stepSize: 1
        }
    },
    3: {
        id: 'month',
        scale: TimeseriesScale.days,
        start: 30,
        max_items: 30,
        timeOptions: {
            unit: 'day',
            displayFormats: {
                day: 'MMM Do YY, h:mm a'
            },
            stepSize: 1
        }
    },
    4: {
        id: 'six_month',
        scale: TimeseriesScale.days,
        start: 180,
        max_items: 180,
        timeOptions: {
            unit: 'day',
            displayFormats: {
                day: 'MMM Do YY, h:mm a'
            },
            stepSize: 1
        }
    },
    5: {
        id: 'year',
        scale: TimeseriesScale.days,
        start: 360,
        max_items: 360,
        timeOptions: {
            unit: 'day',
            displayFormats: {
                day: 'MMM Do YY, h:mm a'
            },
            stepSize: 1
        }
    }
    // 6: {
    //     id: 'all',
    //     scale: TimeseriesScale.minutes,
    //     start: 60,
    //     max_items: 60
    // }
}

@Component({
    components: {
        Chart
    },
    apollo: {
        getChartData: {
            query: getTimeseriesData,
            variables() {
                return this.getQueryVars(this.chartKey, this.scale, this.start)
            },
            skip() {
                return this.loadingOffset
            },
            subscribeToMore: {
                document: timeseriesEthAvg,
                variables() {
                    return this.getSubscriptionVars(this.chartKey, this.scale)
                },
                updateQuery(previousResult, { subscriptionData }) {
                    if (previousResult && subscriptionData.data.timeseriesEvent) {
                        const prevItems = previousResult.getTimeseriesData.items
                        const newItem = subscriptionData.data.timeseriesEvent.item
                        if (!newItem) {
                            return previousResult
                        }
                        const newItems = this.addSubscriptionItem(newItem, prevItems)
                        while (newItems.length > this.maxItems) {
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
                    this.chartDataSet = [...this.mapItemsToDataSet(data.getTimeseriesData.items, this.value_type)]
                    this.loadingData = false
                }
            },
            error(error) {
                this.hasError = true
            }
        }
    }
})
export default class TimeSeriesChartData extends Mixins(ChartDataMixin) {
    @Prop({ type: String, required: true }) chartRef!: string
    /*
    ===================================================================================
     Initial Data
    ===================================================================================
    */

    getChartData!: GetTimeseriesDataType
    chartDataSet: DataPoint[] = []
    scale = DEFAULT_DATA[0].scale
    maxItems = DEFAULT_DATA[0].max_items
    start = DEFAULT_DATA[0].start
    timeOptions = DEFAULT_DATA[0].timeOptions
    loadingData = true
    currentUnit = DEFAULT_DATA[0].timeOptions.unit
    hasError = false

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get chartKey(): TimeseriesKey {
        return ChartRouteKey[this.chartRef].key
    }

    get title(): string {
        return `${this.$t(`charts.${this.chartRef}.title`)}`
    }
    get description(): string {
        return `${this.$t(`charts.${this.chartRef}.description`)}`
    }
    get value_type(): TimeseriesValue {
        return TimeseriesValueKey[this.chartKey]
    }
    get isPending(): boolean {
        return this.chartKey === TimeseriesKey.PENDING_TX_COUNT_AVG || this.chartKey === TimeseriesKey.PENDING_TX_COUNT_TOTAL
    }

    get chartData(): ChartData | null {
        const _datasets: Dataset[] = []
        if (this.chartDataSet) {
            _datasets.push({
                data: this.chartDataSet,
                label: `${this.$t(`charts.${this.chartRef}.label`)}`,
                backgroundColor: 'rgba(118, 221, 251, 0.2)',
                borderColor: '#2c82be',
                borderWidth: 2
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
                        time: this.timeOptions,
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
                            labelString: `${this.$t(`charts.${this.chartRef}.label`)}`
                        },
                        ticks: {
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
    get loading(): boolean {
        return this.loadingOffset || this.loadingData || this.hasError
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    /**
     * Sets time frame for chart
     * @param value {Number}
     */
    setTimeFrame(value: number): void {
        if (this.currentUnit !== DEFAULT_DATA[value].timeOptions.unit) {
            this.loadingData = true
            this.currentUnit = DEFAULT_DATA[value].timeOptions.unit
        }
        this.scale = DEFAULT_DATA[value].scale
        this.maxItems = DEFAULT_DATA[value].max_items
        this.start = DEFAULT_DATA[value].start
        this.timeOptions = DEFAULT_DATA[value].timeOptions
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
