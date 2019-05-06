import { AvgGasPriceMetric } from '@app/core/api/apollo/types/AvgGasPriceMetric'
import BigNumber from 'bignumber.js'

export class AvgGasPriceMetricExt implements AvgGasPriceMetric {
  __typename!: 'AggregateBlockMetric'

  avgGasPrice: any | null
  timestamp: any | null

  constructor(proto: any) {
    Object.assign(this, proto)
  }

  get avgGasPriceBN(): BigNumber {
    return new BigNumber(this.avgGasPrice!, 16)
  }

  get timestampDate(): Date {
    return new Date(this.timestamp!)
  }
}
