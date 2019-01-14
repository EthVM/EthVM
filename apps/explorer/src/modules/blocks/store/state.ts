import { FIFO, ItemProcessor } from '@app/core/store/utils'
import { Block } from '@app/core/models'

const dedup = (block: Block, pastBlocks: Block[]): Block[] => {
  for (let i = 0; i < pastBlocks.length; i++) {
    if (block.getId() === pastBlocks[i].getId()) {
      pastBlocks.splice(i, 1)
    }
  }
  return pastBlocks
}

const blockProccesor: ItemProcessor<Block> = (block: Block, pastBlocks: Block[]): Block[] => {
  const blocks = dedup(block, pastBlocks)
  blocks.unshift(block)
  return blocks
}

const State = {
  blocks: new FIFO<Block>(parseInt(process.env.VUE_APP_MAX_BLOCK_IN_MEMORY), blockProccesor)
}

export default State
