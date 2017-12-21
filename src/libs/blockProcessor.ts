import { Block } from '@/libs'
import globConfigs from '@/configs/global.json'

let setUncles = (block: Block, hash: string, blocks: Array<Block>): Array<Block> => {
	for (let i = 0; i < blocks.length; i++) {
		if (blocks[i].getHash().toString() == hash) {
			blocks[i].setIsUncle(true)
			block.addUncle(blocks[i])
		}
	}
	return blocks;
}
let setUnclesToUnclesAndAdd = (block: Block, pastBlocks: Array<Block>): Array<Block> => {
	let uncleHashes = block.getUncleHashes()
	for (let i = 0; i < uncleHashes.length; i++) {
		pastBlocks = setUncles(block, uncleHashes[i].toString(), pastBlocks)
	}
	pastBlocks.unshift(block)
	return pastBlocks
}
let dedup = (pastBlocks: Array<Block>): Array<Block> => {
	for (let i = 0; i < pastBlocks.length; i++) {
		for (let j = 0; j < pastBlocks.length; j++) {
			if (i != j && pastBlocks[i].getId() == pastBlocks[j].getId()) pastBlocks.splice(j, 1)
		}
		return pastBlocks
	}
}
let processBlocks = (block: Block, pastBlocks: Array<Block>): Array<Block> => {
	pastBlocks = setUnclesToUnclesAndAdd(block, pastBlocks)
	pastBlocks = dedup(pastBlocks)
	return pastBlocks
}
export default processBlocks