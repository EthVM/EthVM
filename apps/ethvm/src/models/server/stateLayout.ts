import { FIFO } from '@app/helpers'
import { Block, Tx } from '@app/models'

export interface StateLayout {
  txs: FIFO<Tx>
  blocks: FIFO<Block>
}
