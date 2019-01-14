import { Block, Tx, PendingTx, Uncle } from '@app/core/models'
import { State } from '@app/core/store/state'

export default {
  all: (state: State): State => state,
  blocks: (state: State): Block[] => state.blocks.items(),
  uncles: (state: State): Uncle[] => state.uncles.items(),
  txs: (state: State): Tx[] => state.txs.items(),
  pendingTxs: (state: State): PendingTx[] => state.pendingTxs.items()
}
