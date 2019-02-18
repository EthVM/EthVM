import { Block, PendingTx, Tx, Uncle } from '@app/core/models'
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
  blockMetrics: FIFO<BlockMetrics>
  txs: FIFO<Tx>
  pendingTxs: FIFO<PendingTx>
  uncles: FIFO<Uncle>
  syncing: boolean
}

export const FIFOState: State = {
  blocks: new FIFO<Block>(MAX_BLOCKS, processBlocks),
  blockMetrics: new FIFO<BlockMetrics>(MAX_BLOCKS_METRICS, processBlockMetrics),
  txs: new FIFO<Tx>(MAX_TXS, processTxs),
  pendingTxs: new FIFO<PendingTx>(MAX_PENDING_TXS, processPendingTxs),
  uncles: new FIFO<Uncle>(MAX_UNCLES, processUncles),
  syncing: false
}
