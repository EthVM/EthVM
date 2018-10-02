import globConfigs from '@/configs/global.json'
import { FIFO } from '@app/helpers'
import { Block, Tx, PendingTx } from '@app/models'
import { processBlocks, processTxs, processPendingTxs } from '@app/processor'
import { StateLayout } from '@app/models/server'

const State: StateLayout = {
  txs: new FIFO<Tx>(globConfigs.maxTxsInMemory, processTxs),
  blocks: new FIFO<Block>(globConfigs.maxBlocksInMemory, processBlocks),
  pendingTxs: new FIFO<PendingTx>(globConfigs.maxTxsInMemory, processPendingTxs)
}

export default State
