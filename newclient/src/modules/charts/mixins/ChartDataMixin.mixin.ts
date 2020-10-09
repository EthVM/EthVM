import { Component, Vue } from 'vue-property-decorator'
import { TimeseriesKey, TimeseriesValue, DataPoint } from '@app/modules/charts/models'
import { TimeseriesScale } from '@app/apollo/global/globalTypes'
import { timeseriesEthAvgVariables } from '@app/modules/charts/handlers/apolloTypes/timeseriesEthAvg'
import moment from 'moment'

import {
    getTimeseriesDataVariables,
    getTimeseriesData_getTimeseriesData_items as TimeseriesItemsTypes
} from '@app/modules/charts/handlers/apolloTypes/getTimeseriesData'
import { fromWei, toBN } from 'web3-utils'

@Component
export class ChartDataMixin extends Vue {
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
        return {
            key: _key,
            scale: _scale,
            fromT: moment()
                .add(START * -1, _scale)
                .unix()
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

    addSubscriptionItem(newItem: TimeseriesItemsTypes, _items: TimeseriesItemsTypes[]): TimeseriesItemsTypes[] {
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
     * @param items: TimeseriesItemsTypes
     * @param itemvalueTypes: TimeseriesValue
     * @returns DataPoint
     */
    mapItemsToDataSet(items: TimeseriesItemsTypes[], valueType: TimeseriesValue): DataPoint[] {
        return items.map(item => {
            return {
                x: moment.unix(item.timestamp),
                y: this.getFormat(valueType, item.value)
            }
        })
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
     * Converts received value to Eth
     * @param val: {String}
     * @returns string
     */
    toEth(val: string): string {
        return fromWei(val, 'ether')
    }/**
     * Converts received value toG wei
     * @param val: {String}
     * @returns string
     */
    toGwei(val: string): string {
        return fromWei(val, 'gwei')
    }/**
     * Converts received value toU SDT
     * @param val: {String}
     * @returns string
     */
    toUSDT(val: string): string {
        let _val = toBN(val)
        _val = _val.div(toBN(10).pow(toBN(6)))
        return _val.toNumber().toString()
    }
}
