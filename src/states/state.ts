import Vue from 'vue'
import { stateLayout } from '@/typeLayouts'
import { FIFO, Block, Tx, processBlocks, processTxs } from '@/libs'
import globConfigs from '@/configs/global.json'

let State: stateLayout = {
	txs: new FIFO<Tx>(globConfigs.maxTxsInMemory, processTxs),
	blocks: new FIFO<Block>(globConfigs.maxBlocksInMemory, processBlocks),
}

export default State