import {BlockMetric} from '@app/core/api/apollo/types/BlockMetric'
import BigNumber from 'bignumber.js'

export class BlockMetricExt implements BlockMetric {

  __typename!: "BlockMetric"
  avgGasLimit!: any | null
  avgGasPrice!: any | null
  avgTxFees!: any | null
  blockHash!: string | null
  difficulty!: any | null
  numFailedTxs!: number | null
  numInternalTxs!: number | null
  numSuccessfulTxs!: number | null
  numUncles!: number | null
  number!: any
  totalDifficulty!: any | null
  totalGasPrice!: any | null
  totalTxs!: number | null
  totalTxFees!: any | null
  blockTime!: number | null
  timestamp!: number | null


  constructor(proto: any) {
    Object.assign(this, proto)
  }

  get numberBN(): BigNumber | null {
    return this.number ? new BigNumber(this.number, 16) : null
  }

  get avgGasLimitBN(): BigNumber | null {
    return this.avgGasLimit ? new BigNumber(this.avgGasLimit, 16) : null
  }

  get avgGasPriceBN(): BigNumber | null {
    return this.avgGasPrice ? new BigNumber(this.avgGasPrice, 16) : null
  }

  get avgTxFeesBN(): BigNumber | null {
    return this.avgTxFees ? new BigNumber(this.avgTxFees, 16) : null
  }

  get blockTimeDate(): Date | null {
    return this.blockTime ? new Date(this.blockTime * 1000) : null
  }

  get timestampDate(): Date | null {
    return this.timestamp ? new Date(this.timestamp * 1000) : null
  }

  get difficultyBN(): BigNumber | null {
    return this.difficulty ? new BigNumber(this.difficulty, 16) : null
  }

  get totalDifficultyBN(): BigNumber | null {
    return this.totalDifficulty ? new BigNumber(this.totalDifficulty, 16) : null
  }

  get totalGasPriceBN(): BigNumber | null {
    return this.totalGasPrice ? new BigNumber(this.totalGasPrice, 16) : null
  }

  get totalTxFeesBN(): BigNumber | null {
    return this.totalTxFees ? new BigNumber(this.totalTxFees, 16) : null
  }

}
