import { BlockMetrics } from 'ethvm-common'

const toBlockMetrics = (stat: any): BlockMetrics => {
  stat.avgGasPrice = stat.avgGasPrice.toString()
  stat.avgTxFees = stat.avgTxFees.toString()
  stat.totalDifficulty = stat.totalDifficulty.toString()
  stat.difficulty = stat.difficulty.toString()
  stat.totalGasPrice = stat.totalGasPrice.toString()
  stat.totalTxFees = stat.totalTxFees.toString()
  return stat
}

export { toBlockMetrics }
