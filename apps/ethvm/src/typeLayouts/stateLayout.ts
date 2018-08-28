import { FIFO } from '@app/libs'
import { Block, Tx } from '@app/models'

interface Latest {
  block?: Block
  tx?: Tx
}

export default interface StateLayout {
  txs: FIFO<Tx>
  blocks: FIFO<Block>
}
