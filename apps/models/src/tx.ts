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
  blockHash?: string
  blockNumber?: number
  hash?: string
  timestamp?: Timestamp
  nonce?: string
  from?: string
  to?: string
  contractAddress?: string
  status?: boolean
  data?: Buffer
  fee?: Buffer
  logs?: Log
  result?: boolean
  gasPrice?: Buffer
  gasLimit?: Buffer
  gasUsed?: Buffer
  gasRefund?: Buffer
  gasLeftover?: Buffer
  traces?: Trace[]
  v?: number
  r?: Buffer
  s?: Buffer
  value?: Buffer
}
