import { FIFO } from '@app/store/utils'
import { Block, Tx, PendingTx, Uncle } from '@app/models'

export interface StateLayout {
  txs: FIFO<Tx>
  pendingTxs: FIFO<PendingTx>
  blocks: FIFO<Block>
  uncles: FIFO<Uncle>
}
