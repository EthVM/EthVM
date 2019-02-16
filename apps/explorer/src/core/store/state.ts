import { Block, PendingTx, SimpleBlock, Tx, Uncle } from '@app/core/models'
import { processBlockMetrics, processBlocks, processPendingTxs, processTxs, processUncles } from '@app/core/store/processors'
import { FIFO } from '@app/core/store/utils'
import { BlockMetrics } from 'ethvm-common'

const MAX_BLOCKS = parseInt(process.env.VUE_APP_MAX_BLOCK_IN_MEMORY)
const MAX_BLOCKS_METRICS = parseInt(process.env.VUE_APP_MAX_BLOCK_IN_MEMORY)
const MAX_TXS = parseInt(process.env.VUE_APP_MAX_TX_IN_MEMORY)
const MAX_PENDING_TXS = parseInt(process.env.VUE_APP_MAX_PTX_IN_MEMORY)
const MAX_UNCLES = parseInt(process.env.VUE_APP_MAX_UNCLE_IN_MEMORY)

export interface State {
  blocks: FIFO<Block>
  simpleBlocks: FIFO<SimpleBlock>
  blockMetrics: FIFO<BlockMetrics>
  txs: FIFO<Tx>
  pendingTxs: FIFO<PendingTx>
  uncles: FIFO<Uncle>
}

export const FIFOState: State = {
  blocks: new FIFO<Block>(MAX_BLOCKS, processBlocks as any),
  simpleBlocks: new FIFO<SimpleBlock>(MAX_BLOCKS, processBlocks as any),
  blockMetrics: new FIFO<BlockMetrics>(MAX_BLOCKS_METRICS, processBlockMetrics),
  txs: new FIFO<Tx>(MAX_TXS, processTxs),
  pendingTxs: new FIFO<PendingTx>(MAX_PENDING_TXS, processPendingTxs),
  uncles: new FIFO<Uncle>(MAX_UNCLES, processUncles)
}
