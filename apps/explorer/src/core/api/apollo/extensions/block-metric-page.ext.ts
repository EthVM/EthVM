import { BlockMetricPage, BlockMetricPage_items } from '@app/core/api/apollo/types/BlockMetricPage'
import BigNumber from 'bignumber.js'

export class BlockMetricPageExt_items implements BlockMetricPage_items {
  __typename!: 'BlockMetric'
  avgGasLimit: any
  avgGasPrice: any
  avgTxFees: any
  blockHash!: string
  blockTime!: number
  difficulty: any
  numFailedTxs!: number
  numInternalTxs!: number
  numSuccessfulTxs!: number
  numUncles!: number
  number: any
  timestamp: any
  totalDifficulty: any
  totalGasPrice: any
  totalTxFees: any
  totalTxs!: number

  constructor(proto: any) {
    Object.assign(this, proto)
  }

  get numberBN(): BigNumber {
    return new BigNumber(this.number)
  }

  get avgGasLimitBN(): BigNumber {
    return new BigNumber(this.avgGasLimit)
  }

  get avgGasPriceBN(): BigNumber {
    return new BigNumber(this.avgGasPrice)
  }

  get avgTxFeesBN(): BigNumber {
    return new BigNumber(this.avgTxFees)
  }

  get timestampDate(): Date {
    return new Date(this.timestamp)
  }

  get difficultyBN(): BigNumber {
    return new BigNumber(this.difficulty)
  }

  get totalDifficultyBN(): BigNumber {
    return new BigNumber(this.totalDifficulty)
  }

  get totalGasPriceBN(): BigNumber {
    return new BigNumber(this.totalGasPrice)
  }

  get totalTxFeesBN(): BigNumber {
    return new BigNumber(this.totalTxFees)
  }
}

export class BlockMetricPageExt implements BlockMetricPage {
  __typename!: 'BlockMetricPage'
  items: BlockMetricPageExt_items[]
  limit: number
  offset: number
  totalCount: number

  constructor(proto: BlockMetricPage) {
    this.offset = proto.offset
    this.limit = proto.limit
    this.totalCount = proto.totalCount
    this.items = proto.items.map(i => new BlockMetricPageExt_items(i))
  }
}
