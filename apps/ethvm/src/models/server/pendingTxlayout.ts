export interface PendingTxLayout {
  nonce: Buffer
  from: string
  to: string
  contractAddress: string
  value: Buffer
  data: Buffer
  gasPrice: Buffer
  gasLimit: Buffer
  v: number
  r: Buffer
  s: Buffer
}
