export interface Log {
  address: string
  data: string
  topics: string[]
}

export interface Trace {
  blockHash: string
  blockNumber: number
  transactionHash: string
  transactionPosition: number
  action: any[]
  result: any
  subtraces: number
  type: string
}

export interface TxReceipt {
  blockHash: string
  blockNumber: number
  transactionHash: string
  transactionIndex: number
  cumulativeGasUsed: string
  contractAddress: string
  gasUsed: string
  logs: Log[]
  logsBloom: string
  traces: Trace[]
  status: any
}

export interface Tx {
  hash: string
  nonce: string
  blockHash: string
  blockNumber: number
  transactionIndex: number
  from: string
  to: string
  value: string
  gasPrice: string
  gas: string
  input: string
  v: number
  r: string
  s: string
  timestamp: number
  receipt: TxReceipt
}
