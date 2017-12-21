import { stateLayout, txLayout, blockLayout } from '@/typeLayouts'
import defaultRooms from '@/configs/defaultRooms.json'
import sEvents from '@/configs/socketEvents.json'
import { Block, Tx, processBlocks, processTxs } from '@/libs'

let SOCKET_CONNECT = function(state: stateLayout, _msg: string) {
	defaultRooms.forEach((_room) => {
		this._vm.$socket.emit(sEvents.join, _room)
	})
}

let addNewBlock = function(state: stateLayout, block: blockLayout) {
	//console.log(block)
	state.blocks.add(new Block(block))
}
let addNewTx = function(state: stateLayout, tx: txLayout) {
	state.txs.add(new Tx(tx))
   //console.log(new Tx(tx).getTrace())
}
let NEW_BLOCK = function(state: stateLayout, block: blockLayout) {
	if (Array.isArray(block)) {
		block.sort(function(a, b) { return a.intNumber - b.intNumber })
		block.forEach((_block: blockLayout, idx: number) => {
			addNewBlock(state, _block)
			//NEW_TX(state, _block.transactions)
		})
	} else {
		addNewBlock(state, block)
		//NEW_TX(state, block.transactions)
	}

}

let NEW_TX = function(state: stateLayout, tx: txLayout | Array<txLayout>) {
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