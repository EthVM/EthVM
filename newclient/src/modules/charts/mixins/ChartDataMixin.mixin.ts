import { Component, Vue } from 'vue-property-decorator'
import { TimeseriesKey, TimeseriesValue, DataPoint } from '@app/modules/charts/models'
import { TimeseriesScale } from '@app/apollo/global/globalTypes'
import { timeseriesEthAvgVariables } from '@app/modules/charts/handlers/apolloTypes/timeseriesEthAvg'
import { getTimestamp } from './getServerTimestamp.graphql'
import moment from 'moment'
import BN from 'bignumber.js'

import {
    getTimeseriesDataVariables,
    getTimeseriesData_getTimeseriesData_items as TimeseriesItemsTypes
} from '@app/modules/charts/handlers/apolloTypes/getTimeseriesData'
import { fromWei, toBN } from 'web3-utils'

@Component({
    apollo: {
        getTimestamp: {
            query: getTimestamp,
            update: data => data.getTimestamp,

            result({ data }) {
                if (data) {
                    /**
                     * Set server time offset if difference is greater then 999 milliseconds
                     */
                    const now = new BN(moment().valueOf())
                    const server = new BN(data.getTimestamp)
                    const offset = server.minus(now)
                    if (offset.abs().isGreaterThan(999)) {
                        this.serverTimeOffset = offset.toFixed()
                    }
                }
            },
            error() {
                this.serverTmpsError = true
            }
        }
    }
})
export class ChartDataMixin extends Vue {
    /*
    ===================================================================================
      Data
    ===================================================================================
    */

    serverTimeOffset = 0
    getTimestamp!: string
    serverTmpsError = false

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    /**
     * Var to identify whether or not server offest was loaded
     * Used in skipping TimeSereies Quereis in charts
     * @returns bolean
     */
    get loadingOffset(): boolean {
        return this.$apollo.queries.getTimestamp.loading || this.serverTmpsError
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */

    /**
     * Creates getTimeseriesData query and subsequent subscription, to get timeseries data for the chart
     * @param _key: TimeseriesKey | string, defines which data to get. ie: Gas Price Ave. Use Strings only to get address balances as those requre additional params passed to the key.
     * @param _scale: TimeseriesScale, defines which timeseries to get. ie: hours
     * @param _start: number, defines the starting point to get data from. ie: if _scale = 'minutes' and _start = 10, the query will return data points for the last 10 minutes. Values by defualt will be returned from getStart()
     * @return - returns getTimeseriesDataVariables data type
     */

    getQueryVars(_key: TimeseriesKey, _scale: TimeseriesScale, _start?: number): getTimeseriesDataVariables {
        const START = _start ? _start : this.getStart(_scale)
        const time = moment().add(this.serverTimeOffset)
        return {
            key: _key,
            scale: _scale,
            fromT: time.subtract(START, _scale).unix()
        }
    }

    /**
     * Creates getTimeseriesData query and subsequent subscription, to get timeseries data for the chart
     * @param _key: TimeseriesKey | string, defines which data to get. ie: Gas Price Ave. Use Strings only to get address balances as those requre additional params passed to the key.
     * @param _scale: TimeseriesScale, defines which timeseries to get. ie: hours
     * @return - returns timeseriesEthAvgVariables data type
     */

    getSubscriptionVars(_key: TimeseriesKey, _scale: TimeseriesScale): timeseriesEthAvgVariables {
        return {
            key: _key,
            scale: _scale
        }
    }

    /**
     * Creates getTimeseriesData query and subsequent subscription, to get timeseries data for the chart
     * @param _key: TimeseriesItemsTypes
     * @param _scale: TimeseriesScale, defines which timeseries to get. ie: hours
     * @return - returns TimeseriesItemsTypes data type
     */

    addSubscriptionItem(newItem: TimeseriesItemsTypes, _items: TimeseriesItemsTypes[], max: number | null = null): TimeseriesItemsTypes[] {
        let isNew = true
        _items.forEach((item, index) => {
            if (!isNew) {
                return
            }
            if (item.timestamp === newItem.timestamp) {
                _items.splice(index, 1, newItem)
                isNew = false
            }
        })
        if (isNew) {
            _items.push(newItem)
        }
        return _items
    }

    /**
     * Returns defualt values of number of points to return, according to the time frame provided
     * @param _scale: TimeseriesScale, ie: minutes.
     * @return: number
     * _scale === 'minutes', return 60 data points for the last hour.
     * _scale === 'hours, return 24 data points for the last day
     * _scale === 'days' return 30 data points for the last month
     * default returns 300 data points for the last 5 minutes
     */
    getStart(_scale: TimeseriesScale): number {
        switch (_scale) {
            case TimeseriesScale.minutes:
                return 60
            case TimeseriesScale.hours:
                return 24
            case TimeseriesScale.days:
                return 30
            default:
                return 300
        }
    }

    /**
     * Maps items into formatted object with x and y values
     * Filters null values if any
     * @param items: TimeseriesItemsTypes
     * @param valueTypes: TimeseriesValue
     * @returns DataPoint
     */
    mapItemsToDataSet(items: (TimeseriesItemsTypes | null)[], valueType: TimeseriesValue): DataPoint[] {
        const filtered: DataPoint[] = []
        items.forEach(item => {
            if (item) {
                filtered.push({
                    x: moment.unix(item.timestamp),
                    y: this.getFormat(valueType, item.value)
                })
            }
        })
        return filtered
    }

    /**
     * Formats time to its corresponding values
     * @param valueType: TimeseriesValue
     * @param value: string
     * @return: string
     */
    getFormat(valueType: TimeseriesValue, value: string): string {
        switch (valueType) {
            case TimeseriesValue.GWEI:
                return this.toGwei(value)
            case TimeseriesValue.USD:
                return this.toUSDT(value)
            case TimeseriesValue.NUMBER:
                return value.toString()
            default:
                return this.toEth(value)
        }
    }
    /**
     * Converts received value to ETH
     * @param val: {String}
     * @returns string
     */
    toEth(val: string): string {
        return fromWei(val, 'ether')
    }

    /**
     * Converts received value to GWEI
     * @param val: {String}
     * @returns string
     */
    toGwei(val: string): string {
        return fromWei(val, 'gwei')
    }

    /**
     * Converts received value to USDT
     * @param val: {String}
     * @returns string
     */
    toUSDT(val: string): string {
        let _val = toBN(val)
        _val = _val.div(toBN(10).pow(toBN(6)))
        return _val.toNumber().toString()
    }
}
