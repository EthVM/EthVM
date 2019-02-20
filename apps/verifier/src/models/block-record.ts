import { BlockHeaderRecord } from '@app/models/block-header-record'
import { BlockRewardRecord } from '@app/models/block-reward-record'
import { TxReceiptRecord } from '@app/models/tx-receipt-record'
import { TxRecord } from '@app/models/tx-record'
import { UBigIntAsNumber } from '@app/utils'

export class BlockRecord {
  header: BlockHeaderRecord
  transactions: TxRecord[]
  transactionReceipts: TxReceiptRecord[]
  uncles: BlockHeaderRecord[]
  rewards: BlockRewardRecord[]

  unclesHash: Buffer
  totalDifficulty: Buffer

  constructor(props) {
    Object.assign(this, props)

    this.header = new BlockHeaderRecord(props.header)
    this.transactions = props.transactions.map(tx => new TxRecord(tx)) || []
    this.transactionReceipts = props.transactionReceipts.map(receipt => new TxReceiptRecord(receipt)) || []
    this.uncles = props.uncles.map(uncle => new BlockHeaderRecord(uncle)) || []
    this.rewards = props.rewards.map(reward => new BlockRewardRecord(reward)) || []
  }

  get _totalDifficulty(): number {
    return UBigIntAsNumber(this.totalDifficulty)
  }
}
