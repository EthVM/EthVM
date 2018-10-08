import { Block, Tx } from '@app/models'

interface IblockStats {
  blockTime: string
  failed: string
  success: string
  avgGasPrice: string
  avgTxFees: string
  pendingTxs: number
}

export interface Header {
  parentHash: string
  unclesHash?: string
  timestamp?: number
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

export interface BlockLayout {
  number: number
  hash: string
  header: Header
  stats: BlockStats
  transactions?: string[]
  uncles?: string[]
}
