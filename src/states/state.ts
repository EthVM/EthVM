import globConfigs from '@/configs/global.json'
import { Block, FIFO, processBlocks, processTxs, Tx } from '@/libs'
import { stateLayout } from '@/typeLayouts'
import Vue from 'vue'

const State: stateLayout = {
  txs: new FIFO<Tx>(globConfigs.maxTxsInMemory, processTxs),
  blocks: new FIFO<Block>(globConfigs.maxBlocksInMemory, processBlocks)
}

export default State
