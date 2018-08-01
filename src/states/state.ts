import { Block, FIFO, processBlocks, processTxs, Tx } from '@/libs'
import { StateLayout } from '@/typeLayouts'

import globConfigs from '@/configs/global.json'

const State: StateLayout = {
  txs: new FIFO<Tx>(globConfigs.maxTxsInMemory, processTxs),
  blocks: new FIFO<Block>(globConfigs.maxBlocksInMemory, processBlocks)
}

export default State
