import globConfigs from '@/configs/global.json'
import { FIFO, processBlocks, processTxs } from '@app/helpers'
import { Block, StateLayout, Tx } from '@app/models'

const State: StateLayout = {
  txs: new FIFO<Tx>(globConfigs.maxTxsInMemory, processTxs),
  blocks: new FIFO<Block>(globConfigs.maxBlocksInMemory, processBlocks)
}

export default State
