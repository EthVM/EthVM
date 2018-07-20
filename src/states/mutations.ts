import { Block, Tx } from '@/libs'
import { BlockLayout, StateLayout, TxLayout } from '/typeLayouts'

const NEW_BLOCK = (state: StateLayout, block: BlockLayout | BlockLayout[]) => {
  if (Array.isArray(block)) {
    block.forEach(_block => {
      state.blocks.add(new Block(_block))
    })
  }
  else { state.blocks.add(new Block(block)) }
}

const NEW_TX = (state: StateLayout, tx: TxLayout | TxLayout[]) => {
  if (Array.isArray(tx)) {
    tx.forEach(_tx => {
      state.txs.add(new Tx(_tx))
    })
  }
  else { state.txs.add(new Tx(tx)) }
}

export default {
  NEW_BLOCK,
  NEW_TX
}
