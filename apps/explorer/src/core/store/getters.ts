import { Block, Tx, PendingTx, Uncle } from '@app/core/models'
import { State } from '@app/core/store/state'

export default {
  all: (state: State): State => state,

  // Blocks
  blocks: (state: State): Block[] => state.blocks.items(),

  blockByHash: (state: State) => (id: string): Block | null => state.blocks.items().find(block => block.getId() === id),

  blockByNumber: (state: State) => (n: number): Block | null => state.blocks.items().find(block => block.getNumber() === n),

  // Uncles
  uncles: (state: State): Uncle[] => state.uncles.items(),

  // Txs
  txs: (state: State): Tx[] => state.txs.items(),

  // PendingTxs
  pendingTxs: (state: State): PendingTx[] => state.pendingTxs.items()
}
