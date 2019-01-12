import { Block, Tx, PendingTx, Uncle } from '@app/core/models'
import { State } from '@app/core/store/state'

export default {
  all: (state: State): State => state,
  getBlocks: (state: State): Block[] => state.blocks.items(),
  getUncles: (state: State): Uncle[] => state.uncles.items(),
  getTxs: (state: State): Tx[] => state.txs.items(),
  getPendingTxs: (state: State): PendingTx[] => state.pendingTxs.items()
}
