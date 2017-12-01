import { stateLayout, txLayout } from './state'

let all = (state: stateLayout): stateLayout => {
	return state
}

let getCount = (state: stateLayout): number => {
	return state.count
}

let getTxs = (state: stateLayout): Array<txLayout> => {
	return state.txs
}

export default {
	all,
	getCount,
	getTxs
}