import { BlockMetrics } from 'ethvm-common'

const toBlockMetrics = (bm: any): BlockMetrics => {
  bm.number = bm.number.toString()
  bm.avgGasPrice = bm.avgGasPrice.toString()
  bm.avgTxFees = bm.avgTxFees.toString()
  bm.totalDifficulty = bm.totalDifficulty.toString()
  bm.difficulty = bm.difficulty.toString()
  bm.totalGasPrice = bm.totalGasPrice.toString()
  bm.totalTxFees = bm.totalTxFees.toString()
  return bm
}

export { toBlockMetrics }
