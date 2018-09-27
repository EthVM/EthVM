import { Timestamp } from 'bson'

export interface Log {
  address: string
  topics: Buffer[]
  data: Buffer
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
  gasRefund?: Buffer
  gasUsed?: Buffer
  hash?: string
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
}
