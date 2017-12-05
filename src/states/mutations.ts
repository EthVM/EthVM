import { stateLayout, txLayout } from './state'

let incrementCount = (state: stateLayout) => {
	state.count++
}

let setTxs = (state: stateLayout, _txs: Array<txLayout>) => {
	state.txs = _txs
}

export default {
	incrementCount,
	setTxs
}