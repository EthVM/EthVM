import { Block, FIFO, Tx } from '@/libs/'

interface latest {
  block?: Block
  tx?: Tx
}

export default interface stateLayout {
  txs: FIFO<Tx>
  blocks: FIFO<Block>
}
