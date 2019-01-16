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
      rewards.push(r)
    })
    block.rewards = rewards
  }

  if (block.transactions) {
    const txs: any = []
    block.transactions.forEach(tx => txs.push(toTx(tx)))
    block.transactions = txs
  }

  if (block.uncles) {
    const uncles: any = []
    block.uncles.forEach(u => uncles.push(toUncle(u)))
    block.uncles = uncles
  }

  // TODO: Convert proper stats once they're restored
  block.stats = {}
  block.stats.processingTimeMs = 0
  block.stats.successfulTxs = 0
  block.stats.failedTxs = 0
  block.stats.pendingTxs = 0
  block.stats.txs = 0
  block.stats.internalTxs = 0

  return block
}

export { toBlock }
