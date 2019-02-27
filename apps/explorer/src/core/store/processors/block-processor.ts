import { Block, SimpleBlock } from '@app/core/models'

const dedup = (block: Block | SimpleBlock, pastBlocks: Block[] | SimpleBlock[]): Block[] | SimpleBlock[] => {
  for (let i = 0; i < pastBlocks.length; i++) {
    if (block.getId() === pastBlocks[i].getId()) {
      pastBlocks.splice(i, 1)
    }
  }
  return pastBlocks
}

export const processBlocks = (block: Block | SimpleBlock, pastBlocks: Block[] | SimpleBlock[]): Block[] | SimpleBlock[] => {
  pastBlocks = dedup(block, pastBlocks)
  pastBlocks.unshift(block as any)
  return pastBlocks
}
