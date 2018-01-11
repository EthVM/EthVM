import { stateLayout, txLayout } from '@/typeLayouts'
import { Block, Tx } from '@/libs'
let all = (state: stateLayout): stateLayout => {
	return state
}

let getTxs = (state: stateLayout): Array<Tx> => {
	return state.txs.items()
}

let getBlocks = (state: stateLayout): Array<Block> => {
	let blocks = []
	state.blocks.items().forEach((block)=>{
		if(!block.getIsUncle()) blocks.push(block)
	})
	return blocks

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