import { Block, Tx } from '@/libs'
import { stateLayout, txLayout } from '@/typeLayouts'

const all = (state: stateLayout): stateLayout => {
  return state
}

const getTxs = (state: stateLayout): Tx[] => {
  return state.txs.items()
}

const getBlocks = (state: stateLayout): Block[] => {
  const blocks = []
  state.blocks.items().forEach(block => {
    if (!block.getIsUncle()) { blocks.push(block) }
  })
  return blocks
}

export default {
  all,
  getTxs,
  getBlocks
}
