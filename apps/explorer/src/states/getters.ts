import { Block, Tx, PendingTx, Uncle } from '@app/models'
import { StateLayout } from '@app/states/layouts'

export default {
  all: (state: StateLayout): StateLayout => state,
  getBlocks: (state: StateLayout): Block[] => state.blocks.items(),
  getUncles: (state: StateLayout): Uncle[] => state.uncles.items(),
  getTxs: (state: StateLayout): Tx[] => state.txs.items(),
  getPendingTxs: (state: StateLayout): PendingTx[] => state.pendingTxs.items()
}
