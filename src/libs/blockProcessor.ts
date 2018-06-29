import { Block } from '@/libs'
import globConfigs from '@/configs/global.json'

let setUncles = (block: Block, hash: string, blocks: Array<Block>): Array<Block> => {
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].getHash().toString() == hash) {
      blocks[i].setIsUncle(true)
      block.addUncle(blocks[i])
      blocks.splice(i, 1)
    }
  }
  return blocks
}
let setUnclesToUnclesAndAdd = (block: Block, pastBlocks: Array<Block>): Array<Block> => {
  let uncleHashes = block.getUncleHashes()
  for (let i = 0; i < uncleHashes.length; i++) {
    pastBlocks = setUncles(block, uncleHashes[i].toString(), pastBlocks)
  }
  pastBlocks.unshift(block)
  return pastBlocks
}
let dedup = (block: Block, pastBlocks: Array<Block>): Array<Block> => {
  for (let i = 0; i < pastBlocks.length; i++) {
    if (block.getId() == pastBlocks[i].getId()) pastBlocks.splice(i, 1)
  }
  return pastBlocks
}
let processBlocks = (block: Block, pastBlocks: Array<Block>): Array<Block> => {
  pastBlocks = dedup(block, pastBlocks)
  pastBlocks = setUnclesToUnclesAndAdd(block, pastBlocks)
  pastBlocks.sort(function(a, b) {
    return b.getIntNumber() - a.getIntNumber()
  })
  return pastBlocks
}
export default processBlocks
