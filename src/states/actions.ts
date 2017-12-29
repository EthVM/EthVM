import { stateLayout, txLayout, blockLayout } from '@/typeLayouts'
import { Block, Tx } from '@/libs'
import defaultRooms from '@/configs/defaultRooms.json'
import sEvents from '@/configs/socketEvents.json'

let socket_newBlock = function({ commit, state: stateLayout }, block: blockLayout | Array<blockLayout>) {
	let _this = this
	if (Array.isArray(block)) {
		block.sort(function(a, b) { return a.intNumber - b.intNumber })
		block.forEach((_block: blockLayout, idx: number) => {
			_this._vm.$eventHub.$emit(sEvents.newBlock, new Block(_block))
		})
	} else _this._vm.$eventHub.$emit(sEvents.newBlock, new Block(block))
}

let socket_newTx = function({ commit, state: stateLayout }, tx: txLayout) {
	let _this = this
	if (Array.isArray(tx)) {
		tx.forEach((_tx: txLayout, idx: number) => {
			_this._vm.$eventHub.$emit(sEvents.newTx, new Tx(_tx))
		})
	} else _this._vm.$eventHub.$emit(sEvents.newTx, new Tx(tx))
}

let socket_latestTx = function({commit, state: stateLayout}, tx: txLayout) {
	commit(sEvents.setLatestTx, new Tx(tx))
}

let socket_latestBlock = function({ commit, state: stateLayout }, block: blockLayout) {
	commit (sEvents.setLatestBlock, new Block(block))
}
let socket_connect = function({ commit, state: stateLayout }, tx: txLayout) {
	defaultRooms.forEach((_room) => {
		this._vm.$socket.emit(sEvents.join, _room)
	})
}
export default {
	socket_newBlock,
	socket_newTx,
	socket_connect,
	socket_latestTx,
	socket_latestBlock
}