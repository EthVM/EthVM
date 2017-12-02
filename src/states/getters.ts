import { stateLayout, txLayout, blockLayout } from './state'

let all = (state: stateLayout): stateLayout => {
	return state
}

let getCount = (state: stateLayout): number => {
	return state.count
}

let getTxs = (state: stateLayout): Array<txLayout> => {
	return state.txs
}

let getBlocks = (state: stateLayout): Array<blockLayout> => {
	return state.blocks
}

export default {
	all,
	getCount,
	getTxs,
	getBlocks
}