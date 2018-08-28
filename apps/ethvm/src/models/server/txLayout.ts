export interface TxLayout {
  root: Buffer
  blockHash: Buffer
  blockNumber: number
  transactionIndex: Buffer
  from: Buffer
  fromBalance: Buffer
  to: Buffer
  toBalance: Buffer
  gasUsed: Buffer
  cumulativeGasUsed: Buffer
  contractAddress: Buffer
  logsBloom: Buffer
  gas: Buffer
  gasPrice: Buffer
  hash: string
  input: Buffer
  nonce: Buffer
  value: Buffer
  v: Buffer
  r: Buffer
  s: Buffer
  status: boolean
  pending: boolean
  timestamp: Buffer
}
