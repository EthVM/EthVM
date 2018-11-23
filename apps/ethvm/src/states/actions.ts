import defaultRooms from '@app/configs/defaultRooms.json'
import { Events as sEvents } from 'ethvm-common'
import { Block, Tx, PendingTx, Uncle } from '@app/models'
import { EventLayout } from '@app/models/server'

const socket_socketNewblock = function({ commit }, ev: EventLayout | EventLayout[]) {
  if (Array.isArray(ev)) {
    ev.forEach(_event => {
      commit(sEvents.newBlock, _event.value)
      this._vm.$eventHub.$emit(sEvents.newBlock, new Block(_event.value))
    })
  } else {
    commit(sEvents.newBlock, ev.value)
    this._vm.$eventHub.$emit(sEvents.newBlock, new Block(ev.value))
  }
}


const socket_socketNewuncle = function({ commit }, ev: EventLayout | EventLayout[]) {
  console.log('socket_socketNewuncle')
  if (Array.isArray(ev)) {
    ev.forEach(_event => {
      commit(sEvents.newUncle, _event.value)
      this._vm.$eventHub.$emit(sEvents.newUncle, new Uncle(_event.value))
    })
  } else {
    commit(sEvents.newUncle, ev.value)
    this._vm.$eventHub.$emit(sEvents.newUncle, new Uncle(ev.value))
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

const socket_socketNewptx = function({ commit }, ev: EventLayout | EventLayout[]) {
  if (Array.isArray(ev)) {
    ev.forEach(_event => {
      commit(sEvents.newPendingTx, _event.value)
      this._vm.$eventHub.$emit(sEvents.newPendingTx, new PendingTx(_event.value))
    })
  } else {
    commit(sEvents.newPendingTx, ev.value)
    this._vm.$eventHub.$emit(sEvents.newPendingTx, new PendingTx(ev.value))
  }
}

// eslint-disable-next-line
const socket_socketConnect = function({}) {
  this._vm.$socket.emit(sEvents.join, { rooms: defaultRooms })
}

export default {
  socket_socketNewblock,
  socket_socketNewtx,
  socket_socketNewptx,
  socket_socketNewuncle,
  socket_socketConnect
}
