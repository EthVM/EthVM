import { Block, Tx } from '@app/models'
import { BlockLayout, StateLayout, TxLayout } from '@app/models/server'

const NEW_BLOCK = (state: StateLayout, blocks: BlockLayout | BlockLayout[]) => {
  if (!Array.isArray(blocks)) {
    blocks = [blocks]
  }

  blocks.forEach(block => {
    state.blocks.add(new Block(block))
  })
}

const NEW_TX = (state: StateLayout, txs: TxLayout | TxLayout[]) => {
  if (!Array.isArray(txs)) {
    txs = [txs]
  }

  txs.forEach(tx => {
    state.txs.add(new Tx(tx))
  })
}

export default {
  NEW_BLOCK,
  NEW_TX
}
