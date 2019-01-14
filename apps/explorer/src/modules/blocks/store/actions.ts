import { Events } from 'ethvm-common'
import { Block } from '@app/core/models'
import { EventLayout } from '@app/core/store/layouts'

const socket_socketNewblock = function({ commit }, raw: EventLayout | EventLayout[]) {
  const evs = !Array.isArray(raw) ? [raw] : raw
  evs.forEach(ev => {
    commit(Events.newBlock, ev.value)
    this._vm.$eventHub.$emit(Events.newBlock, new Block(ev.value))
  })
}

export default { socket_socketNewblock }
