import { stateLayout, txLayout, blockLayout } from '@/typeLayouts'

let socket_newBlock = function({ commit, state: stateLayout }, block: blockLayout) {
	commit('NEW_BLOCK', block)
}

let socket_newTx = function({ commit, state: stateLayout }, tx: txLayout) {
	commit('NEW_TX', tx)
}

export default {
	socket_newBlock,
	socket_newTx
}