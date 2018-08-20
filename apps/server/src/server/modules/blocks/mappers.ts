import { Block, SmallBlock } from '@app/server/modules/blocks'
import { BlockStats } from '@app/server/modules/stats'
import { Tx } from '@app/server/modules/txs'
import BigNumber from 'bignumber.js'
import * as utils from 'web3-utils'

const toSmallBlock = (block: Block): SmallBlock => {
  return {
    number: block.number,
    intNumber: block.intNumber,
    hash: block.hash,
    miner: block.miner,
    timestamp: block.timestamp,
    transactionCount: block.transactionHashes ? block.transactionHashes.length : 0,
    uncleHashes: block.uncleHashes,
    isUncle: block.isUncle,
    totalBlockReward: Buffer.from(
      new BigNumber(utils.toHex(block.blockReward))
        .plus(new BigNumber(utils.toHex(block.txFees)))
        .plus(new BigNumber(utils.toHex(block.uncleReward)))
        .toString(16),
      'hex'
    ),
    blockReward: block.blockReward,
    txFees: block.txFees,
    stateRoot: block.stateRoot,
    uncleReward: block.uncleReward,
    difficulty: block.difficulty,
    blockStats: block.blockStats
  }
}

const toBlockStats = (txs: Tx[] = [], blockTime: BigNumber): BlockStats => {
  if (txs.length === 0) {
    const zero = utils.toHex(0)
    return {
      blockTime: zero,
      failed: zero,
      success: zero,
      avgGasPrice: zero,
      avgTxFees: zero
    }
  }

  const txStatus = {
    failed: new BigNumber(0),
    success: new BigNumber(0),
    totGasPrice: new BigNumber(0),
    totTxFees: new BigNumber(0)
  }

  txs.forEach(tx => {
    if (tx.status) {
      txStatus.success = txStatus.success.plus(1)
    } else {
      txStatus.failed = txStatus.failed.plus(1)
    }
    txStatus.totGasPrice = txStatus.totGasPrice.plus(new BigNumber(utils.toHex(tx.gasPrice)))
    txStatus.totTxFees = txStatus.totTxFees.plus(new BigNumber(utils.toHex(tx.gasPrice)).times(new BigNumber(utils.toHex(tx.gasUsed))))
  })

  return {
    blockTime: utils.toHex(blockTime),
    failed: utils.toHex(txStatus.failed),
    success: utils.toHex(txStatus.success),
    avgGasPrice: utils.toHex(txStatus.totGasPrice.div(txs.length).integerValue(BigNumber.ROUND_CEIL)),
    avgTxFees: utils.toHex(txStatus.totTxFees.div(txs.length).integerValue(BigNumber.ROUND_CEIL))
  }
}

const mappers = {
  toSmallBlock,
  toBlockStats
}

export { mappers }
