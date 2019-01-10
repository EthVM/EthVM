import { Block, Tx, PendingTx, Uncle } from '@app/models'
import { State } from '@app/store/state'
import { Tx as TxLayout, Block as BlockLayout, PendingTx as PendingTxLayout, Uncle as UncleLayout } from 'ethvm-common'

const NEW_BLOCK = (state: State, raw: BlockLayout | BlockLayout[]) => {
  const blocks = !Array.isArray(raw) ? [raw] : raw
  blocks.forEach(block => state.blocks.add(new Block(block)))
}

const NEW_TX = (state: State, raw: TxLayout | TxLayout[]) => {
  const txs = !Array.isArray(raw) ? [raw] : raw
  txs.forEach(tx => state.txs.add(new Tx(tx)))
}

const NEW_PENDING_TX = (state: State, raw: PendingTxLayout | PendingTxLayout[]) => {
  const pTxs = !Array.isArray(raw) ? [raw] : raw
  pTxs.forEach(pTx => state.pendingTxs.add(new PendingTx(pTx)))
}

const NEW_UNCLE = (state: State, raw: UncleLayout | UncleLayout[]) => {
  const uncles = !Array.isArray(raw) ? [raw] : raw
  uncles.forEach(uncle => state.uncles.add(new Uncle(uncle)))
}

export default {
  NEW_BLOCK,
  NEW_TX,
  NEW_UNCLE,
  NEW_PENDING_TX
}
