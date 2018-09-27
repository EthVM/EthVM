import { Block, BlockStats, SmallBlock } from '@app/server/modules/blocks'
import { Tx } from '@app/server/modules/txs'
import BigNumber from 'bignumber.js'
import * as utils from 'web3-utils'

const toSmallBlock = (block: Block): SmallBlock => {
  return {
    number: block.number,
    hash: block.hash,
    miner: block.header.miner,
    timestamp: block.header.timestamp,
    transactionCount: block.stats.totalTxs,
    difficulty: block.header.difficulty,
    stateRoot: block.header.stateRoot,
    totalBlockReward: block.header.rewards.block.header.miner + block.header.rewards.block.header.unclesHash,
    blockReward: block.header.rewards.block.header.miner,
    txFees: block.stats.totalTxsFees,
    uncleReward: block.header.rewards.block.header.unclesHash,
    blockStats: block.stats
  }
}

const toBlockStats = (txs: Tx[] = [], blockTime: BigNumber): BlockStats => {
  const zero = utils.toHex(0)

  if (txs.length === 0) {
    return {
      pendingTxs: zero
    }
  }

  return {
    // TODO calc pending tx
    pendingTxs: zero
  }
}

const mappers = {
  toSmallBlock,
  toBlockStats
}

export { mappers }
