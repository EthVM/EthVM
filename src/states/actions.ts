import { stateLayout, txLayout, blockLayout } from '@/typeLayouts'
import { Block, Tx } from '@/libs'
import defaultRooms from '@/configs/defaultRooms.json'
import sEvents from '@/configs/socketEvents.json'

let socket_newBlock = function({ commit, state: stateLayout }, block: blockLayout | Array<blockLayout>) {
	commit('NEW_BLOCK', block)
	this._vm.$eventHub.$emit(sEvents.newBlock, Array.isArray(block) ? new Block(block[0]) : new Block(block))
}
let socket_newTx = function({ commit, state: stateLayout }, tx: txLayout | Array<txLayout>) {
	commit('NEW_TX', tx)
	this._vm.$eventHub.$emit(sEvents.newTx, Array.isArray(tx) ? new Tx(tx[0]) : new Tx(tx))
}
let socket_connect = function({ commit, state: stateLayout }, tx: txLayout) {
	defaultRooms.forEach((_room) => {
		this._vm.$socket.emit(sEvents.join, _room)
	})
	this._vm.$socket.emit(sEvents.pastTxs, '', (_txs) => {
		commit('NEW_TX', _txs)
		this._vm.$eventHub.$emit(sEvents.pastTxsR)
		this._vm.$eventHub.$emit(sEvents.newTx, new Tx(_txs[0]))
	})
	this._vm.$socket.emit(sEvents.pastBlocks, '', (_blocks) => {
		commit('NEW_BLOCK', _blocks)
		this._vm.$eventHub.$emit(sEvents.newBlock, new Block(_blocks[0]))
		this._vm.$eventHub.$emit(sEvents.pastBlocksR)
	})
}
export default {
	socket_newBlock,
	socket_newTx,
	socket_connect
}