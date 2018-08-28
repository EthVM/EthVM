import globConfigs from '@/configs/global.json'
import { FIFO } from '@app/libs'
import { Block, Tx } from '@app/models'
import { processBlocks, processTxs } from '@app/processor'
import { StateLayout } from '@app/models/server'

const State: StateLayout = {
  txs: new FIFO<Tx>(globConfigs.maxTxsInMemory, processTxs),
  blocks: new FIFO<Block>(globConfigs.maxBlocksInMemory, processBlocks)
}

export default State
