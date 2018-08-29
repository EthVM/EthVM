import { Block, Tx } from '@app/models'
import { StateLayout } from '@app/models/server'

const all = (state: StateLayout): StateLayout => {
  return state
}

const getTxs = (state: StateLayout): Tx[] => {
  return state.txs.items()
}

const getBlocks = (state: StateLayout): Block[] => {
  const blocks = []
  state.blocks.items().forEach(block => {
    if (!block.getIsUncle()) {
      blocks.push(block)
    }
  })
  return blocks
}

export default {
  all,
  getTxs,
  getBlocks
}
