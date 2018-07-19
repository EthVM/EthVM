import { Block, Tx } from '@/libs'
import { blockLayout, stateLayout, txLayout } from '@/typeLayouts'

const SOCKET_CONNECT = function(state: stateLayout, _msg: string) {}

const NEW_BLOCK = function(state: stateLayout, block: blockLayout | blockLayout[]) {
  if (Array.isArray(block)) {
    block.forEach(_block => {
      state.blocks.add(new Block(_block))
    })
  }
  else { state.blocks.add(new Block(block)) }
}

const NEW_TX = function(state: stateLayout, tx: txLayout | txLayout[]) {
  if (Array.isArray(tx)) {
    tx.forEach(_tx => {
      state.txs.add(new Tx(_tx))
    })
  }
  else { state.txs.add(new Tx(tx)) }
}

export default {
  SOCKET_CONNECT,
  NEW_BLOCK,
  NEW_TX
}
