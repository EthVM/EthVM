import { toTx } from '@app/server/modules/txs'
import { toUncle } from '@app/server/modules/uncles'
import { Block } from 'ethvm-common'

const toBlock = (block: any): Block => {
  block.header.number = block.header.number.toString()
  block.header.difficulty = block.header.difficulty.toString()
  block.header.gasLimit = block.header.gasLimit.toString()
  block.header.gasUsed = block.header.gasUsed.toString()
  block.totalDifficulty = block.totalDifficulty.toString()

  if (block.rewards) {
    const rewards: any = []
    block.rewards.forEach(r => {
      r.reward = r.reward.toString()
      rewards.unshift(r)
    })
    block.rewards = rewards
  }

  if (block.transactions) {
    block.transactions = block.transactions.map(tx => toTx(tx))
  }

  if (block.uncles) {
    block.uncles = block.uncles.map(u => toUncle(u))
  }

  return block
}

export { toBlock }
