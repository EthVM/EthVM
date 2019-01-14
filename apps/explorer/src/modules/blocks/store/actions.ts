import { Events, SocketEvent } from 'ethvm-common'
import { Block } from '@app/core/models'

const socket_socketNewblock = function({ commit }, raw: SocketEvent | SocketEvent[]) {
  const evs = !Array.isArray(raw) ? [raw] : raw
  evs.forEach(ev => {
    commit(Events.newBlock, ev.value)
    this._vm.$eventHub.$emit(Events.newBlock, new Block(ev.value))
  })
}

export default { socket_socketNewblock }
