import globConfigs from '@/configs/global.json'
import { FIFO, processBlocks, processTxs } from '@app/libs'
import { Block, Tx } from '@app/models'
import { StateLayout } from '@app/typeLayouts'

const State: StateLayout = {
  txs: new FIFO<Tx>(globConfigs.maxTxsInMemory, processTxs),
  blocks: new FIFO<Block>(globConfigs.maxBlocksInMemory, processBlocks)
}

export default State
