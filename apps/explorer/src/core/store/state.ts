import { BlockMetrics, SimpleBlock, Tx } from '@app/core/models'
import { processBlockMetrics, processBlocks, processTxs } from '@app/core/store/processors'
import { FIFO } from '@app/core/store/utils'

const MAX_BLOCKS = 100
const MAX_BLOCKS_METRICS = 100
const MAX_TXS = 100

export interface State {
  simpleBlocks: FIFO<SimpleBlock>
  blockMetrics: FIFO<BlockMetrics>
  txs: FIFO<Tx>
  syncing: boolean
}

export const FIFOState: State = {
  simpleBlocks: new FIFO<SimpleBlock>(MAX_BLOCKS, processBlocks as any),
  blockMetrics: new FIFO<BlockMetrics>(MAX_BLOCKS_METRICS, processBlockMetrics),
  txs: new FIFO<Tx>(MAX_TXS, processTxs),
  syncing: false
}
