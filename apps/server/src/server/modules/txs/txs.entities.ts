export interface Trace {
  op: string
  value: Buffer
  from: Buffer
  fromBalance: Buffer
  to: Buffer
  toBalance: Buffer
  input: Buffer
}

export interface Log {
  address: string
  topics: Buffer[]
  data: Buffer
}

export interface Receipt {
  postTxState: Buffer
  cumulativeGas: Buffer
  gasUsed: Buffer
  bloomFilter: Buffer
  executionResult: Buffer
  logs: Log[]
}

export interface Tx {
  hash: string
  blockHash: string
  transactionIndex: number
  blockNumber: number
  nonce: Buffer
  from: Buffer
  to: Buffer
  value: Buffer
  gasPrice: Buffer
  gasLimit: Buffer
  data: Buffer
  receipt?: Receipt
}
