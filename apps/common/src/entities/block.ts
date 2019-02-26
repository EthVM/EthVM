import { Uncle } from './uncle'
import { Tx } from './tx'

export interface Reward {
  rewardType: string
  address: string
  value: string
}

export interface Header {
  number: number
  hash: string
  parentHash: string
  nonce: string
  sha3Uncles: string
  logsBloom: string
  transactionsRoot: string
  stateRoot: string
  receiptsRoot: string
  author: string
  difficulty: string
  extraData: string
  gasLimit: string
  gasUsed: string
  size: number
  timestamp: number
}

export interface Block {
  header: Header
  totalDifficulty: string
  transactions: Tx[]
  uncles: Uncle[]
  unclesHash: string
  rewards: Reward[]
}
