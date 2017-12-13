import { stateLayout, txLayout, blockLayout } from '@/typeLayouts'
import defaultRooms from '@/configs/defaultRooms.json'
import sEvents from '@/configs/socketEvents.json'
import { Block, Tx, processBlocks, processTxs } from '@/libs'

let SOCKET_CONNECT = function(state: stateLayout, _msg: string) {
	defaultRooms.forEach((_room) => {
		this._vm.$socket.emit(sEvents.join, _room)
	})
	this._vm.$socket.emit('pastBlocks', '')
	this._vm.$socket.emit('pastTxs', '')
}

let addNewBlock = function(state: stateLayout, block: blockLayout) {
	console.log(block.intNumber, block)
	state.blocks.add(new Block(block))
	state.blocks = processBlocks(new Block(block), state.blocks)
}
let addNewTx = function(state: stateLayout, tx: txLayout) {
	state.txs.add(new Tx(tx))
	state.txs = processTxs(new Tx(tx), state.txs)
}
let NEW_BLOCK = function(state: stateLayout, block: blockLayout) {
	if (Array.isArray(block)) {
		block.forEach((_block: blockLayout, idx: number) => {
			addNewBlock(state, _block)
		})
	} else {
		addNewBlock(state, block)
	}

}

let NEW_TX = function(state: stateLayout, tx: txLayout) {
	if (Array.isArray(tx)) {
		tx.forEach((_tx: txLayout, idx: number) => {
			addNewTx(state, _tx)
		})
	} else {
		addNewTx(state, tx)
	}
}

export default {
	SOCKET_CONNECT,
	NEW_BLOCK,
	NEW_TX
}