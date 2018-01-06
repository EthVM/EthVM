import { stateLayout, txLayout, blockLayout } from '@/typeLayouts'
import { Tx, Block} from '@/libs'

let SOCKET_CONNECT = function(state: stateLayout, _msg: string) {}

let NEW_BLOCK = function(state: stateLayout, block: blockLayout | Array<blockLayout>) {
	if (Array.isArray(block)) block.forEach((_block) => {
		state.blocks.add(new Block(_block))
	})
	else state.blocks.add(new Block(block))
}

let NEW_TX = function(state: stateLayout, tx: txLayout | Array<txLayout>) {
	if(Array.isArray(tx)) tx.forEach((_tx)=>{
		state.txs.add(new Tx(_tx))
	})
	else state.txs.add(new Tx(tx))
}

let SET_LATEST_TX = function(state: stateLayout, tx: txLayout) {
	state.data.latest.tx = new Tx(tx)
}

let SET_LATEST_BLOCK = function(state: stateLayout, block: blockLayout) {
	state.data.latest.block = new Block(block)
}
export default {
	SOCKET_CONNECT,
	NEW_BLOCK,
	NEW_TX,
	SET_LATEST_TX,
	SET_LATEST_BLOCK
}