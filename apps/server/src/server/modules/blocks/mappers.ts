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
    transactionCount: block.stats.txs,
    difficulty: block.header.difficulty,
    stateRoot: block.header.stateRoot,
    totalBlockReward: block.header.rewards[block.header.miner], // add miner, uncle block reward
    blockReward: block.header.rewards[block.header.miner],
    txFees: block.stats.totalTxsFees,
    uncleReward: block.header.rewards[block.header.miner], // need uncle hash
    blockStats: block.stats
  }
}

const mappers = {
  toSmallBlock
}

export { mappers }
