import { Uncle } from './uncle'
import { Tx } from './tx'

export interface SmallBlock {
  number: number
  hash: string
}

export interface BlockStats {
  successfulTxs?: number
  failedTxs?: number
  pendingTxs?: number
  processingTimeMs?: number
  txs?: number
  internalTxs?: number
  avgGasPrice?: number
  avgTxsFees?: number
  totalGasPrice?: number
  totalTxsFees?: number
}

export interface Reward {
  address: string
  reward: Buffer
}

export interface Header {
  number: Buffer
  hash: string
  parentHash: string
  nonce: string
  sha3Uncles: string
  logsBloom: string
  transactionsRoot: string
  stateRoot: string
  receiptsRoot: string
  author: string
  difficulty: Buffer
  extraData: string
  gasLimit: string
  gasUsed: string
  timestamp: number
}

export interface Block {
  header: Header
  totalDifficulty: Buffer
  transactions: Tx[]
  uncles: Uncle[]
  unclesHash: string
  rewards: Reward[]
  stats: BlockStats
}
