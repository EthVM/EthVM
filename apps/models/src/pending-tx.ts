export interface PendingTx {
  hash?: string
  nonce: string
  from: string
  to: string
  contractAddress: string
  value: Buffer
  data: Buffer
  gasPrice: number
  gasLimit: number
  v: number
  r: number
  s: number
}
