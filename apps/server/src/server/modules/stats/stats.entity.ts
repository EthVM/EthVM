export interface BlockStats {
  blockTime: string
  failedTxs: string
  successfulTxs: string
  avgGasPrice: string
  avgTxFees: string
  pendingTxs?: number
}
