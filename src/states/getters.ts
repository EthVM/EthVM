import { stateLayout, txLayout } from '@/typeLayouts'
import { Block, Tx } from '@/libs'
let all = (state: stateLayout): stateLayout => {
  return state
}

let getTxs = (state: stateLayout): Array<Tx> => {
  return state.txs.items()
}

let getBlocks = (state: stateLayout): Array<Block> => {
  let blocks = []
  state.blocks.items().forEach(block => {
    if (!block.getIsUncle()) blocks.push(block)
  })
  return blocks
}

export default {
  all,
  getTxs,
  getBlocks
}
