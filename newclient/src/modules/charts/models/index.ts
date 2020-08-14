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

export enum TimeseriesValueType {
    GWEI = 'GWEI',
    USD = 'USD',
    ETH = 'ETH',
    NUMBER = 'NUMBER'
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
