import defaultRooms from '@app/configs/defaultRooms.json'
import sEvents from '@app/configs/socketEvents.json'
import { Block, Tx } from '@app/models'
import { BlockLayout, TxLayout, EventLayout } from '@app/models/server'

const socket_socketNewblock = function({ commit }, ev: EventLayout | EventLayout[]) {

  if (Array.isArray(ev)) {
    ev.forEach(_event => {
      commit(sEvents.newBlock, _event.value)
      this._vm.$eventHub.$emit(sEvents.newBlock, new Block(_event.value))
    })
  } else {
    commit(sEvents.newBlock, ev.value )
    this._vm.$eventHub.$emit(sEvents.newBlock, new Block(ev.value))
  }
}

const socket_socketNewtx = function({ commit }, ev: EventLayout | EventLayout[]) {

  if (Array.isArray(ev)) {
    ev.forEach(_event => {
      commit(sEvents.newTx, _event.value)
      this._vm.$eventHub.$emit(sEvents.newTx, new Tx(_event.value))
    })
  } else {
    commit(sEvents.newTx, ev.value)
    this._vm.$eventHub.$emit(sEvents.newTx, new Tx(ev.value))
  }
}

// eslint-disable-next-line
const socket_socketConnect = function({}) {
  this._vm.$socket.emit(sEvents.join, { rooms: defaultRooms })
}

export default {
  socket_socketNewblock,
  socket_socketNewtx,
  socket_socketConnect
}
