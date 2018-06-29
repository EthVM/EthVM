import { txLayout } from '@/typeLayouts'
import { Block, Tx } from '@/libs'
import { Hash } from '@/libs/common'
interface IblockStats {
  blockTime: string
  failed: string
  success: string
  avgGasPrice: string
  avgTxFees: string
  pendingTxs: number
}
export default interface blockLayout {
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
  transactions: Array<Tx>
  transactionHashes: Array<Buffer>
  transactionCount: number
  uncleHashes: any
  uncles: Array<Block>
  isUncle: boolean
  txFees: Buffer
  blockReward: Buffer
  uncleReward: Buffer
  totalBlockReward: Buffer
  blockStats: IblockStats
}
