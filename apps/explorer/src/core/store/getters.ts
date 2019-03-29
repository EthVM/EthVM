import { BlockMetrics, Tx, SimpleBlock } from '@app/core/models'
import { State } from '@app/core/store/state'
import { FIFO } from '@app/core/store/utils'

export default {
  // Simple Blocks
  simpleBlocks: (state: State): SimpleBlock[] => state.simpleBlocks.items(),

  // Block Metrics
  blockMetrics: (state: State): FIFO<BlockMetrics> => state.blockMetrics,

  // Txs
  txs: (state: State): Tx[] => state.txs.items(),

  // Syncing
  syncing: (state: State): boolean => state.syncing
}
