export interface Log {
  address: Buffer
  topics: Buffer[]
  data: Buffer
  blockNumber: Buffer
  txHash: Buffer
  txIndex: Buffer
  blockHash: Buffer
  index: Buffer
  removed: boolean
}

export interface TxLog {
  hash: Buffer
  logs: Log[]
}

export interface Tx {
  root?: Buffer
  blockHash: Buffer
  blockNumber?: number
  transactionIndex?: Buffer
  from: Buffer
  fromBalance?: Buffer
  to: Buffer
  toBalance?: Buffer
  gasUsed: Buffer
  cumulativeGasUsed?: Buffer
  contractAddress: Buffer | null
  logsBloom?: Buffer | null
  gas: Buffer
  gasPrice: Buffer
  hash: string
  input: Buffer
  nonce?: Buffer
  value: Buffer
  v?: Buffer
  r?: Buffer
  s?: Buffer
  status: boolean
  pending?: boolean
  timestamp: Buffer
}
