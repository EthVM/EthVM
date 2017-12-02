import { stateLayout, txLayout, blockLayout } from './state'

let incrementCount = (state: stateLayout) => {
	state.count++
}

let setTxs = (state: stateLayout, _txs: Array<txLayout>) => {
	state.txs = _txs
}

let setBlocks = (state: stateLayout, _blocks: Array<blockLayout>) => {
	state.blocks = _blocks
}

export default {
	incrementCount,
	setTxs,
	setBlocks
}