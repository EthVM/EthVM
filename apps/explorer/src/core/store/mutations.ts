import { Block, PendingTx, Tx, Uncle, SimpleBlock } from '@app/core/models'
import { State } from '@app/core/store/state'
import { BlockMetrics } from 'ethvm-common'

const NEW_BLOCK = (state: State, raw: Block | Block[]) => {
  const blocks = !Array.isArray(raw) ? [raw] : raw
  blocks.forEach(block => state.blocks.add(block))
}

const NEW_SIMPLE_BLOCK = (state: State, raw: SimpleBlock | SimpleBlock[]) => {
  const blocks = (!Array.isArray(raw) ? [raw] : raw).reverse()
  blocks.forEach(block => state.simpleBlocks.add(block))
}

const NEW_BLOCK_METRIC = (state: State, raw: BlockMetrics | BlockMetrics[]) => {
  const bms = (!Array.isArray(raw) ? [raw] : raw).reverse()
  bms.forEach(bm => state.blockMetrics.add(bm))
}

const NEW_TX = (state: State, raw: Tx | Tx[]) => {
  const txs = !Array.isArray(raw) ? [raw] : raw
  txs.forEach(tx => state.txs.add(tx))
}

const NEW_PENDING_TX = (state: State, raw: PendingTx | PendingTx[]) => {
  const pTxs = !Array.isArray(raw) ? [raw] : raw
  pTxs.forEach(pTx => state.pendingTxs.add(pTx))
}

const NEW_UNCLE = (state: State, raw: Uncle | Uncle[]) => {
  const uncles = !Array.isArray(raw) ? [raw] : raw
  uncles.forEach(uncle => state.uncles.add(uncle))
}

const NEW_SYNC = (state: State, sync: boolean) => {
  state.syncing = sync
}

export default {
  NEW_BLOCK,
  NEW_SIMPLE_BLOCK,
  NEW_BLOCK_METRIC,
  NEW_TX,
  NEW_UNCLE,
  NEW_PENDING_TX,
  NEW_SYNC
}
