import { Events, defaultRooms } from 'ethvm-common'
import { Block, Tx, PendingTx, Uncle } from '@app/core/models'
import { EventLayout } from '@app/core/store/layouts'

const socket_Newblock = function({ commit }, raw: EventLayout | EventLayout[]) {
  const evs = !Array.isArray(raw) ? [raw] : raw
  evs.forEach(ev => {
    commit(Events.newBlock, ev.value)
    this._vm.$eventHub.$emit(Events.newBlock, new Block(ev.value))
  })
}

const socket_Newuncle = function({ commit }, raw: EventLayout | EventLayout[]) {
  const evs = !Array.isArray(raw) ? [raw] : raw
  evs.forEach(ev => {
    commit(Events.newUncle, ev.value)
    this._vm.$eventHub.$emit(Events.newUncle, new Uncle(ev.value))
  })
}

const socket_Newtx = function({ commit }, raw: EventLayout | EventLayout[]) {
  const evs = !Array.isArray(raw) ? [raw] : raw
  evs.forEach(ev => {
    commit(Events.newTx, ev.value)
    this._vm.$eventHub.$emit(Events.newTx, new Tx(ev.value))
  })
}

const socket_Newptx = function({ commit }, raw: EventLayout | EventLayout[]) {
  const evs = !Array.isArray(raw) ? [raw] : raw
  evs.forEach(event => {
    commit(Events.newPendingTx, event.value)
    this._vm.$eventHub.$emit(Events.newPendingTx, new PendingTx(event.value))
  })
}

// eslint-disable-next-line
const socket_connect = function({}) {
  this._vm.$socket.emit(Events.join, { rooms: defaultRooms })
}

export default {
  socket_Newblock,
  socket_Newtx,
  socket_Newptx,
  socket_Newuncle,
  socket_connect
}
