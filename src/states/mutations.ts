import { stateLayout, txLayout, blockLayout } from '@/typeLayouts'
import defaultRooms from '@/configs/defaultRooms.json'
import sEvents from '@/configs/socketEvents.json'
import { Block, Tx, setUnclesToUncles } from '@/libs'

let SOCKET_CONNECT = function(state: stateLayout, _msg: string) {
	defaultRooms.forEach((_room) => {
		this._vm.$socket.emit(sEvents.join, _room)
	})
	this._vm.$socket.emit('pastBlocks', '')
	this._vm.$socket.emit('pastTxs', '')
}

let NEW_BLOCK = function(state: stateLayout, block: blockLayout) {
	console.log(block.intNumber, block)
	state.blocks = setUnclesToUncles(new Block(block), state.blocks)
	state.blocks.add(new Block(block))
}

let NEW_TX = function(state: stateLayout, tx: txLayout) {
	state.txs.add(new Tx(tx))
}

export default {
	SOCKET_CONNECT,
	NEW_BLOCK,
	NEW_TX
}