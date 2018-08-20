import { Block, FIFO, Tx } from '@app/libs'

interface Latest {
  block?: Block
  tx?: Tx
}

export default interface StateLayout {
  txs: FIFO<Tx>
  blocks: FIFO<Block>
}
