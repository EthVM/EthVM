import { TxReceipt } from './tx'

export interface PendingTx {
  hash: string
  nonce: string
  from: string
  to: string
  value: string
  gasPrice: number
  gasLimit: number
  input: string
  v: number
  r: string
  s: string
  timestamp: number
  receipt: TxReceipt
}
