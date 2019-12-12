import { utils } from 'web3'
import Configs from '../../configs'
import getValueTransfers from '../../helpers/get-eth-transfers'
const ETH_CONTRACT = '0xETH'
const VALUE_TYPES = {
  BLOCK_REWARD: '0xBLOCK_REWARD',
  UNCLE_REWARD: '0xUNCLE_REWARD',
  GENESIS: '0xGENESIS'
}
const HEX_ZERO = '0x0'

const getGenesisState = () => {
  return require('ethereumjs-common/dist/genesisStates').genesisStateByName(Configs.CHAIN)
}

const removeZeroTransfers = transfers => {
  return transfers.filter(item => {
    return item.value !== HEX_ZERO
  })
}
class EthTransfers {
  process(block) {
    return new Promise(resolve => {
      if (block.number === 0) {
        const genesis = getGenesisState()
        const transfers = []
        for (const address in genesis) {
          transfers.push({
            transactionHash: VALUE_TYPES.GENESIS,
            timestamp: block.timestamp,
            from: VALUE_TYPES.GENESIS,
            to: address.toLowerCase(),
            value: utils.toHex(utils.toBN(genesis[address])),
            txFee: HEX_ZERO,
            before: {
              from: HEX_ZERO,
              to: HEX_ZERO
            },
            contract: ETH_CONTRACT,
            block: block.number
          })
        }
        return resolve(transfers)
      } else {
        const transfers = []
        block.transactions.forEach(tx => {
          const valueTransfers = getValueTransfers(tx.trace)
          valueTransfers.forEach(transfer => {
            transfers.push({
              transactionHash: tx.hash,
              timestamp: block.timestamp,
              from: transfer.from.toLowerCase(),
              to: transfer.to.toLowerCase(),
              value: transfer.value,
              txFee: utils.toHex(utils.toBN(tx.gasUsed).mul(utils.toBN(tx.gasPrice))),
              before: {
                from: tx.stateDiff[transfer.from.toLowerCase()] ? tx.stateDiff[transfer.from.toLowerCase()].balance['*'].from : HEX_ZERO,
                to: tx.stateDiff[transfer.to.toLowerCase()] ? tx.stateDiff[transfer.to.toLowerCase()].balance['*'].from : HEX_ZERO
              },
              contract: ETH_CONTRACT,
              block: block.number
            })
          })
        })
        block.uncles.forEach(uncle => {
          if (uncle.reward !== HEX_ZERO) {
            transfers.push({
              transactionHash: VALUE_TYPES.UNCLE_REWARD,
              timestamp: block.timestamp,
              from: VALUE_TYPES.UNCLE_REWARD,
              to: uncle.miner.toLowerCase(),
              value: uncle.reward,
              txFee: HEX_ZERO,
              before: {
                from: HEX_ZERO,
                to: uncle.minerBalance.from
              },
              contract: ETH_CONTRACT,
              block: block.number
            })
          }
        })
        if (block.rewards.total !== HEX_ZERO) {
          transfers.push({
            transactionHash: VALUE_TYPES.BLOCK_REWARD,
            timestamp: block.timestamp,
            from: VALUE_TYPES.BLOCK_REWARD,
            to: block.miner.toLowerCase(),
            value: block.rewards.total,
            txFee: HEX_ZERO,
            before: {
              from: HEX_ZERO,
              to: block.minerBalance.from
            },
            contract: ETH_CONTRACT,
            block: block.number
          })
        }
        return resolve(transfers)
      }
    })
  }
}

export default EthTransfers
