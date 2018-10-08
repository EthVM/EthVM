import { Block, Tx, PendingTx, Uncle } from '@app/models'
import { StateLayout } from '@app/models/server'

const all = (state: StateLayout): StateLayout => {
  return state
}

const getPendingTxs = (state: StateLayout): PendingTx[] => {
  return state.pendingTxs.items()
}

const getTxs = (state: StateLayout): Tx[] => {
  return state.txs.items()
}

const getBlocks = (state: StateLayout): Block[] => {
  return state.blocks.items()
}

const getUncles = (state: StateLayout): Uncle[] => {
  return state.uncles.items()
}

export default {
  all,
  getTxs,
  getPendingTxs,
  getUncles,
  getBlocks
}
