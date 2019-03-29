import { Events } from '@app/core/hub'
import { SimpleBlock } from '@app/core/models'

const socket_NEW_SIMPLE_BLOCK = function(this: any, { commit }, raw: any | any[]) {
  const evs = !Array.isArray(raw) ? [raw] : raw
  evs.forEach(ev => {
    const sBlock = new SimpleBlock(ev.value)

    commit(Events.NEW_SIMPLE_BLOCK, sBlock)
    this._vm.$eventHub.$emit(Events.NEW_SIMPLE_BLOCK, sBlock)

    sBlock.getTxs().forEach(tx => {
      commit(Events.NEW_TX, tx)
      this._vm.$eventHub.$emit(Events.NEW_TX, tx)
    })
  })
}

const socket_NEW_BLOCK_METRIC = function(this: any, { commit }, raw: any | any[]) {
  const evs = !Array.isArray(raw) ? [raw] : raw
  evs.forEach(ev => {
    commit(Events.NEW_BLOCK_METRIC, ev.value)
    this._vm.$eventHub.$emit(Events.NEW_BLOCK_METRIC, ev.value)
  })
}

export default {
  socket_NEW_SIMPLE_BLOCK,
  socket_NEW_BLOCK_METRIC
}
