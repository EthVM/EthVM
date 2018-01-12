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

export default {
	SOCKET_CONNECT,
	NEW_BLOCK,
	NEW_TX
}