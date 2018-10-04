import { Timestamp } from 'bson'

export interface SmallBlock {
  number: number
  hash: string
  miner: string
  timestamp?: Timestamp
  transactionCount?: number
  totalBlockReward?: Buffer
  blockReward?: Buffer
  txFees?: Buffer
  stateRoot?: Buffer
  uncleReward?: Buffer
  difficulty?: Buffer
  blockStats?: BlockStats
}

export interface Header {
  parentHash: string
  unclesHash?: string
  timestamp?: Timestamp
  nonce?: Buffer
  miner: string
  rewards: any
  difficulty?: Buffer
  totalDifficulty?: Buffer
  stateRoot?: Buffer
  transactionsRoot?: Buffer
  receiptsRoot: Buffer
  logsBloom?: Buffer
  gasLimit?: Buffer
  gasUsed?: number
  mixHash?: Buffer
  extraData?: Buffer
}

export interface BlockStats {
  blockTimeMs?: number
  successfulTxs?: number
  failedTxs?: number
  txs?: number
  internalTxs?: number
  avgGasPrice?: Buffer
  avgTxsFees?: Buffer
  totalGasPrice?: Buffer
  totalTxsFees?: Buffer
}

export interface Block {
  number: number
  hash: string
  header: Header
  stats: BlockStats
  transactions?: string[]
  uncles?: string[]
}
