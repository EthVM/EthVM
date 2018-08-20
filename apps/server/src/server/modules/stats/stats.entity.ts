export interface BlockStats {
  blockTime: string
  failed: string
  success: string
  avgGasPrice
  avgTxFees
  pendingTxs?: number
}
