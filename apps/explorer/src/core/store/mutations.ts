import { Tx, SimpleBlock } from '@app/core/models'
import { State } from '@app/core/store/state'
import { BlockMetrics } from 'ethvm-common'

const NEW_SIMPLE_BLOCK = (state: State, raw: SimpleBlock | SimpleBlock[]) => {
  const blocks = (!Array.isArray(raw) ? [raw] : raw).reverse()
  blocks.forEach(block => state.simpleBlocks.add(block))
}

const NEW_BLOCK_METRIC = (state: State, raw: BlockMetrics | BlockMetrics[]) => {
  const bms = (!Array.isArray(raw) ? [raw] : raw).reverse()
  bms.forEach(bm => state.blockMetrics.add(bm))
}

const NEW_TX = (state: State, raw: Tx | Tx[]) => {
  const txs = (!Array.isArray(raw) ? [raw] : raw).reverse()
  txs.forEach(tx => state.txs.add(tx))
}

const NEW_SYNC = (state: State, sync: boolean) => {
  state.syncing = sync
}

export default {
  NEW_SIMPLE_BLOCK,
  NEW_BLOCK_METRIC,
  NEW_TX,
  NEW_SYNC
}
