import { stateLayout, txLayout, blockLayout } from '@/typeLayouts'
import { Tx, Block} from '@/libs'

let SOCKET_CONNECT = function(state: stateLayout, _msg: string) {}

let NEW_BLOCK = function(state: stateLayout, block: blockLayout | Array<blockLayout>) {}

let NEW_TX = function(state: stateLayout, tx: txLayout | Array<txLayout>) {}

let SET_LATEST_TX = function(state: stateLayout, tx: Tx) {
	state.data.latest.tx = tx
}

let SET_LATEST_BLOCK = function(state: stateLayout, block: Block) {
	state.data.latest.block = block
}
export default {
	SOCKET_CONNECT,
	NEW_BLOCK,
	NEW_TX,
	SET_LATEST_TX,
	SET_LATEST_BLOCK
}