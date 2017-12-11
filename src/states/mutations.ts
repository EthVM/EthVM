import { stateLayout, txLayout, blockLayout } from '@/typeLayouts'
import defaultRooms from '@/configs/defaultRooms.json'
import sEvents from '@/configs/socketEvents.json'
import {Block} from '@/libs'

let SOCKET_CONNECT = function(state: stateLayout, _msg: string) {
	defaultRooms.forEach((_room) => {
		this._vm.$socket.emit(sEvents.join, _room)
	})
}

let NEW_BLOCK = function(state: stateLayout, block: blockLayout) {
	console.log(block)
	state.blocks.unshift(new Block(block))
}

let NEW_TX = function(state: stateLayout, tx: txLayout) {
	state.txs.unshift(tx)
	if(state.txs.length > 100) state.txs = state.txs.slice(0,100)
}

export default {
	SOCKET_CONNECT,
	NEW_BLOCK,
	NEW_TX
}