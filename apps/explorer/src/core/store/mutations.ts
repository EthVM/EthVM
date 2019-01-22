import { Block, Tx, PendingTx, Uncle } from '@app/core/models'
import { State } from '@app/core/store/state'
import { Tx as RawTx, Block as RawBlock, PendingTx as RawPendingTx, Uncle as RawUncle } from 'ethvm-common'

const NEW_BLOCK = (state: State, raw: RawBlock | RawBlock[]) => {
  const blocks = !Array.isArray(raw) ? [raw] : raw
  blocks.forEach(block => state.blocks.add(new Block(block)))
}

const NEW_TX = (state: State, raw: RawTx | RawTx[]) => {
  const txs = !Array.isArray(raw) ? [raw] : raw
  txs.forEach(tx => state.txs.add(new Tx(tx)))
}

const NEW_PENDING_TX = (state: State, raw: RawPendingTx | RawPendingTx[]) => {
  const pTxs = !Array.isArray(raw) ? [raw] : raw
  pTxs.forEach(pTx => state.pendingTxs.add(new PendingTx(pTx)))
}

const NEW_UNCLE = (state: State, raw: RawUncle | RawUncle[]) => {
  const uncles = !Array.isArray(raw) ? [raw] : raw
  uncles.forEach(uncle => state.uncles.add(new Uncle(uncle)))
}

export default {
  NEW_BLOCK,
  NEW_TX,
  NEW_UNCLE,
  NEW_PENDING_TX
}
