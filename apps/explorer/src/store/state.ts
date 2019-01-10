import { FIFO } from '@app/store/utils'
import { Block, Tx, PendingTx, Uncle } from '@app/models'
import { processBlocks, processTxs, processPendingTxs, processUncles } from '@app/store/processors'

export interface State {
  txs: FIFO<Tx>
  pendingTxs: FIFO<PendingTx>
  blocks: FIFO<Block>
  uncles: FIFO<Uncle>
}

export const StateImpl: State = {
  txs: new FIFO<Tx>(parseInt(process.env.VUE_APP_MAX_TX_IN_MEMORY), processTxs),
  blocks: new FIFO<Block>(parseInt(process.env.VUE_APP_MAX_BLOCK_IN_MEMORY), processBlocks),
  pendingTxs: new FIFO<PendingTx>(parseInt(process.env.VUE_APP_MAX_PTX_IN_MEMORY), processPendingTxs),
  uncles: new FIFO<Uncle>(parseInt(process.env.VUE_APP_MAX_UNCLE_IN_MEMORY), processUncles)
}
