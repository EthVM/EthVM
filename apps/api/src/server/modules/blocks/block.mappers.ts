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
    const txs: any = []
    block.transactions.forEach(tx => txs.unshift(toTx(tx)))
    block.transactions = txs
  }

  if (block.uncles) {
    const uncles: any = []
    block.uncles.forEach(u => uncles.unshift(toUncle(u)))
    block.uncles = uncles
  }

  return block
}

export { toBlock }
