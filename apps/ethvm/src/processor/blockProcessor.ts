import { Block } from '@app/models'

const setUncles = (block: Block, hash: string, blocks: Block[]): Block[] => {
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].getHash() === hash) {
      blocks[i].setIsUncle(true)
      block.addUncle(blocks[i])
      blocks.splice(i, 1)
    }
  }
  return blocks
}

const setUnclesToUnclesAndAdd = (block: Block, pastBlocks: Block[]): Block[] => {
  const uncleHashes = block.getUncleHashes()
  for (const hash of uncleHashes) {
    pastBlocks = setUncles(block, hash.toString(), pastBlocks)
  }
  pastBlocks.unshift(block)
  return pastBlocks
}

const dedup = (block: Block, pastBlocks: Block[]): Block[] => {
  for (let i = 0; i < pastBlocks.length; i++) {
    if (block.getId() === pastBlocks[i].getId()) {
      pastBlocks.splice(i, 1)
    }
  }
  return pastBlocks
}

export const processBlocks = (block: Block, pastBlocks: Block[]): Block[] => {
  pastBlocks = dedup(block, pastBlocks)
  pastBlocks = setUnclesToUnclesAndAdd(block, pastBlocks)
  pastBlocks.sort((a, b) => {
    return b.getNumber() - a.getNumber()
  })
  return pastBlocks
}

