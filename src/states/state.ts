import Vue from 'vue'
import { stateLayout } from '@/typeLayouts'
import { FIFO, Block, Tx } from '@/libs'
import globConfigs from '@/configs/global.json'

let State: stateLayout = {
	txs: new FIFO<Tx>(globConfigs.maxTxsInMemory),
	blocks: new FIFO<Block>(globConfigs.maxBlocksInMemory),
}

export default State