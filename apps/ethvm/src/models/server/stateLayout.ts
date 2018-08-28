import { FIFO } from '@app/helpers'
import { Block, Tx } from '@app/models'

interface Latest {
  block?: Block
  tx?: Tx
}

export interface StateLayout {
  txs: FIFO<Tx>
  blocks: FIFO<Block>
}
