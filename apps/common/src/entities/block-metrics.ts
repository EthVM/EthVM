export interface BlockMetrics {
  hash: string
  number: string
  blockTime: number
  timestamp: number
  avgGasLimit: string
  avgGasPrice: string
  avgTxFees: string
  difficulty: string
  totalDifficulty: string
  numFailedTxs: number
  numPendingTxs: number
  numSuccessfulTxs: number
  numUncles: number
  totalGasPrice: string
  totalTxsFees: string
  totalTxs: number
}
