import { Events, SocketDefaultRooms, SocketEvent } from 'ethvm-common'
import { Block, Tx, PendingTx, Uncle } from '@app/core/models'

const socket_socketNewblock = function({ commit }, raw: SocketEvent | SocketEvent[]) {
  const evs = !Array.isArray(raw) ? [raw] : raw
  evs.forEach(ev => {
    commit(Events.NEW_BLOCK, ev.value)
    this._vm.$eventHub.$emit(Events.NEW_BLOCK, new Block(ev.value))
  })
}

const socket_socketNewuncle = function({ commit }, raw: SocketEvent | SocketEvent[]) {
  const evs = !Array.isArray(raw) ? [raw] : raw
  evs.forEach(ev => {
    commit(Events.NEW_UNCLE, ev.value)
    this._vm.$eventHub.$emit(Events.NEW_UNCLE, new Uncle(ev.value))
  })
}

const socket_socketNewtx = function({ commit }, raw: SocketEvent | SocketEvent[]) {
  const evs = !Array.isArray(raw) ? [raw] : raw
  evs.forEach(ev => {
    commit(Events.NEW_TX, ev.value)
    this._vm.$eventHub.$emit(Events.NEW_TX, new Tx(ev.value))
  })
}

const socket_socketNewptx = function({ commit }, raw: SocketEvent | SocketEvent[]) {
  const evs = !Array.isArray(raw) ? [raw] : raw
  evs.forEach(event => {
    commit(Events.NEW_PENDING_TX, event.value)
    this._vm.$eventHub.$emit(Events.NEW_PENDING_TX, new PendingTx(event.value))
  })
}

// eslint-disable-next-line
const socket_socketConnect = function({}) {
  this._vm.$socket.emit(Events.join, { rooms: SocketDefaultRooms })
}

export default {
  socket_socketNewblock,
  socket_socketNewtx,
  socket_socketNewptx,
  socket_socketNewuncle,
  socket_socketConnect
}
