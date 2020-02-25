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
const normalizeStateDiffs = stateDiff => {
  for (const diff in stateDiff) {
    if (stateDiff[diff].balance['+']) {
      stateDiff[diff].balance['*'] = {
        from: HEX_ZERO,
        to: stateDiff[diff].balance['+']
      }
    } else if (stateDiff[diff].balance['-']) {
      stateDiff[diff].balance['*'] = {
        from: stateDiff[diff].balance['-'],
        to: HEX_ZERO
      }
    }
  }
}
class EthTransfers {
  constructor(web3) {
    this.web3 = web3
  }

  process(block) {
    return new Promise((resolve, reject) => {
      if (block.number === 0) {
        const genesis = getGenesisState()
        const transfers = []
        for (const address in genesis) {
          transfers.push({
            id: `${block.number}-genesis-${address.toLowerCase()}`,
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
        block.transactions.forEach((tx, idx) => {
          const valueTransfers = getValueTransfers(tx.trace)
          normalizeStateDiffs(tx.stateDiff)
          valueTransfers.forEach((transfer, transferIdx) => {
            const valTransfer = {
              id: `${block.number}-transfer-${idx}-${transferIdx}`,
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
            }
            if (!(valTransfer.value === HEX_ZERO && valTransfer.before.from === HEX_ZERO)) {
              transfers.push(valTransfer)
            }
          })
        })
        block.uncles.forEach((uncle, uncleIdx) => {
          if (uncle.reward !== HEX_ZERO) {
            transfers.push({
              id: `${block.number}-uncle-${uncleIdx}`,
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
            id: `${block.number}-block`,
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
        const requests = []
        const indexes = []
        transfers.forEach((transfer, idx) => {
          if (transfer.value === HEX_ZERO && transfer.before.to === HEX_ZERO) {
            requests.push({
              method: 'eth_getBalance',
              params: [transfer.to, utils.toHex(utils.toBN(block.number - 1))],
              id: `${transfer.transactionHash}-${idx}`,
              jsonrpc: '2.0'
            })
            indexes.push(idx)
          }
        })
        if (requests.length) {
          this.web3.currentProvider.send(requests, (err, result) => {
            if (!err) {
              if (result.length !== requests.length) return reject(new Error('most likely chain forked'))
              for (let i = 0; i < result.length; i++) {
                transfers[indexes[i]].before.to = result[i].result
              }
              resolve(transfers)
            } else {
              reject(err)
            }
          })
        } else {
          resolve(transfers)
        }
      }
    })
  }
}

export default EthTransfers
