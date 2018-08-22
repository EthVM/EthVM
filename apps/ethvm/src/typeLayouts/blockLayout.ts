import { Block, Tx } from '@app/libs'

interface IblockStats {
  blockTime: string
  failedTxs: string
  successfulTxs: string
  avgGasPrice: string
  avgTxFees: string
  pendingTxs: number
}

export default interface BlockLayout {
  number: Buffer
  intNumber: number
  hash: Buffer
  parentHash: Buffer
  nonce: Buffer
  mixHash: Buffer
  sha3Uncles: Buffer
  logsBloom: Buffer
  stateRoot: Buffer
  miner: Buffer
  minerBalance: Buffer
  difficulty: Buffer
  totalDifficulty: Buffer
  extraData: Buffer
  size: Buffer
  gasLimit: Buffer
  gasUsed: Buffer
  timestamp: Buffer
  transactionsRoot: Buffer
  receiptsRoot: Buffer
  transactions: Tx[]
  transactionHashes: Buffer[]
  transactionCount: number
  uncleHashes: any
  uncles: Block[]
  isUncle: boolean
  txFees: Buffer
  blockReward: Buffer
  uncleReward: Buffer
  totalBlockReward: Buffer
  blockStats: IblockStats
}
