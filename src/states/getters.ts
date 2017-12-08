import { stateLayout, txLayout, blockLayout } from '@/typeLayouts'

let all = (state: stateLayout): stateLayout => {
	return state
}

let getTxs = (state: stateLayout): Array<txLayout> => {
	return state.txs
}

let getBlocks = (state: stateLayout): Array<blockLayout> => {
	return state.blocks
}

export default {
	all,
	getTxs,
	getBlocks
}