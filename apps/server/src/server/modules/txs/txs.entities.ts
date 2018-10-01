import { Timestamp } from 'bson'

export interface Log {
  address: string
  topics: Buffer[]
  data: Buffer
}

export interface Trace {
  parentHash?: string
  hash?: string
  opcode?: string
  deep?: number
  index?: number
  rejected?: boolean
  from?: Buffer
  to?: Buffer
  value?: Buffer
  data?: Buffer
  gas?: Buffer
  gasPrice?: Buffer
  nonce?: Buffer
}

export interface Tx {
  blockHash: string
  blockNumber: number
  contractAddress?: string
  data?: Buffer
  fee?: Buffer
  from?: string
  gasLeftover?: Buffer
  gasLimit?: Buffer
  gasPrice?: Buffer
  gasRefund?: Buffer
  gasUsed?: Buffer
  hash: string
  internalTxs?: Trace[]
  logs?: Log
  nonce?: Buffer
  r?: Buffer
  result?: boolean
  s?: Buffer
  timestamp: Timestamp
  to?: string
  transactionIndex: number
  v?: number
  value?: Buffer
  status: boolean
}
