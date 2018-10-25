export interface SmallBlock {
  number: number
  hash: string
  miner: string
  timestamp?: number
  transactionCount?: number
  totalBlockReward?: Buffer
  blockReward?: Buffer
  txFees?: Buffer
  stateRoot: Buffer
  uncleReward?: Buffer
  difficulty?: Buffer
  blockStats?: BlockStats
}

export interface Header {
  parentHash: string
  unclesHash?: string
  timestamp?: number
  nonce?: string
  miner: string
  rewards: any
  difficulty?: number
  totalDifficulty?: number
  stateRoot: Buffer
  transactionsRoot?: Buffer
  receiptsRoot: Buffer
  logsBloom?: Buffer
  gasLimit?: number
  gasUsed?: number
  mixHash?: Buffer
  extraData?: Buffer
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

export interface Block {
  number: number
  hash: string
  header: Header
  stats: BlockStats
  transactions?: string[]
  uncles?: string[]
}
