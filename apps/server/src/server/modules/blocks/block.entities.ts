
export interface SmallBlock {
  number: number
  hash: string
  miner: Buffer
  timestamp: Buffer
  transactionCount: number
  uncleHashes?: Buffer[]
  isUncle: boolean
  totalBlockReward?: Buffer
  blockReward?: Buffer
  txFees?: Buffer
  stateRoot?: Buffer
  uncleReward?: Buffer
  difficulty?: Buffer
  blockStats?: BlockStats
}

export interface Header {
  parentHash: Buffer
  unclesHash?: string
  coinbase?: string
  stateRoot?: string
  txTrieRoot?: string
  receiptTrieRoot?: string
  logsBloom?: Buffer
  difficulty?: Buffer
  timestamp?: number
  number: number
  gasLimit?: Buffer
  gasUsed?: number
  mixHash?: Buffer
  extraData?: Buffer
  nonce?: Buffer
}

export interface BlockStats {
  blockTimeMs?: string
  numFailedTxs?: string
  numSuccessfulTxs?: string
  avgGasPrice?: string
  avgTxsFees?: string
}

export interface Block {
  number: number
  hash: string
  header: Header
  stats: BlockStats
  difficulty?: Buffer
}
