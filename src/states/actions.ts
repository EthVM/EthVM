import { stateLayout, txLayout, blockLayout } from '@/typeLayouts'

let socket_newBlock = function({ commit, state: stateLayout }, block: blockLayout) {
	commit('NEW_BLOCK', block)
	block.transactions.forEach((tx, idx)=>{
		commit('NEW_TX', block)
	})
}

let socket_newTx = function({ commit, state: stateLayout }, tx: txLayout) {

}

export default {
	socket_newBlock,
	socket_newTx
}