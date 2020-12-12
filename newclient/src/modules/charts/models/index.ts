import { Moment } from 'moment'
import { TimeseriesScale } from '@app/apollo/global/globalTypes'

export enum TimeseriesKey {
    TX_COUNT_AVG = 'TX_COUNT_AVG',
    TX_COUNT_TOTAL = 'TX_COUNT_TOTAL',
    TX_COUNT_MIN = 'TX_COUNT_MIN',
    TX_COUNT_MAX = 'TX_COUNT_MAX',
    PENDING_TX_COUNT_AVG = 'PENDING_TX_COUNT_AVG',
    PENDING_TX_COUNT_TOTAL = 'PENDING_TX_COUNT_TOTAL',
    GAS_PRICE_AVG = 'GAS_PRICE_AVG',
    GAS_PRICE_MIN = 'GAS_PRICE_MIN',
    GAS_PRICE_MAX = 'GAS_PRICE_MAX',
    ACCOUNT_BALANCE_PREFIX_AVG = 'ACCOUNT_BALANCE_PREFIX_AVG',
    ACCOUNT_BALANCE_PREFIX_MIN = 'ACCOUNT_BALANCE_PREFIX_MIN',
    ACCOUNT_BALANCE_PREFIX_MAX = 'ACCOUNT_BALANCE_PREFIX_MAX'
}
export enum TimeseriesValue {
    GWEI = 'GWEI',
    USD = 'USD',
    ETH = 'ETH',
    NUMBER = 'NUMBER'
}

export const TimeseriesValueKey = {
    TX_COUNT_AVG: TimeseriesValue.NUMBER,
    TX_COUNT_TOTAL: TimeseriesValue.NUMBER,
    TX_COUNT_MIN: TimeseriesValue.NUMBER,
    TX_COUNT_MAX: TimeseriesValue.NUMBER,
    PENDING_TX_COUNT_AVG: TimeseriesValue.NUMBER,
    PENDING_TX_COUNT_TOTAL: TimeseriesValue.NUMBER,
    GAS_PRICE_AVG: TimeseriesValue.GWEI,
    GAS_PRICE_MIN: TimeseriesValue.GWEI,
    GAS_PRICE_MAX: TimeseriesValue.GWEI
}

export interface DataPoint {
    x: Moment
    y: string
}

export interface Dataset {
    label?: string
    data: DataPoint[] | number[]
    yAxisID?: string
    borderColor?: string
    backgroundColor?: string
    borderWidth?: number
    fill?: boolean
    type?: string
}

export interface ChartData {
    labels?: any[]
    datasets: Dataset[]
}

export interface ChartOptions {
    responsive: boolean
    maintainAspectRatio?: boolean
    scales?: Object
    tooltips?: Object
}

export interface TimeOptions {
    unit: string
    displayFormats: {
        minute?: string
        day?: string
    }
    stepSize: number
}
export interface ComponentDataInterface {
    [key: number]: {
        id: string
        scale: TimeseriesScale
        start: number
        max_items: number
        timeOptions: TimeOptions
    }
}

interface ChartRouteKeyInterface {
    [key: string]: {
        key: TimeseriesKey
        link: string
    }
}
export const ChartRouteKey: ChartRouteKeyInterface = {
    average_txs: {
        key: TimeseriesKey.TX_COUNT_AVG,
        link: 'average_txs'
    },
    total_txs: {
        key: TimeseriesKey.TX_COUNT_TOTAL,
        link: 'total_txs'
    },
    min_txs: {
        key: TimeseriesKey.TX_COUNT_MIN,
        link: 'min_txs'
    },
    max_txs: {
        key: TimeseriesKey.TX_COUNT_MAX,
        link: 'max_txs'
    },
    average_new_pending_txs: {
        key: TimeseriesKey.PENDING_TX_COUNT_AVG,
        link: 'average_new_pending_txs'
    },
    total_new_pending_txs: {
        key: TimeseriesKey.PENDING_TX_COUNT_TOTAL,
        link: 'total_new_pending_txs'
    },
    average_gas_price: {
        key: TimeseriesKey.GAS_PRICE_AVG,
        link: 'average_gas_price'
    },
    min_gas_price: {
        key: TimeseriesKey.GAS_PRICE_MIN,
        link: 'min_gas_price'
    },
    max_gas_price: {
        key: TimeseriesKey.GAS_PRICE_MAX,
        link: 'max_gas_price'
    }
}
