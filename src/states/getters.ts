import { stateLayout, txLayout } from '@/typeLayouts'
import { Block, Tx } from '@/libs'
let all = (state: stateLayout): stateLayout => {
	return state
}

let getTxs = (state: stateLayout): Array<Tx> => {
	return state.txs.items()
}

let getBlocks = (state: stateLayout): Array<Block> => {
	return state.blocks.items()
}
let getLatestTransaction = (state: stateLayout): any =>{
	return state.data.latest.tx
}
let getLatestBlock = (state: stateLayout): Block => {
	return state.data.latest.block
}

export default {
	all,
	getTxs,
	getBlocks,
	getLatestTransaction,
	getLatestBlock
}