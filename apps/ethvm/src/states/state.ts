import globConfigs from '@/configs/global.json'
import { Block, FIFO, processBlocks, processTxs, Tx } from '@app/libs'
import { StateLayout } from '@app/typeLayouts'

const State: StateLayout = {
  txs: new FIFO<Tx>(globConfigs.maxTxsInMemory, processTxs),
  blocks: new FIFO<Block>(globConfigs.maxBlocksInMemory, processBlocks)
}

export default State
