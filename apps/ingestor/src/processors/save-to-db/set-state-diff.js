import { utils } from 'web3'
import BlockProcessor from '../process-block'
import { getBatchEthBalance } from '../../helpers'
import getValueTransfers from '../../helpers/get-eth-transfers'
import TraceTypes from '../../helpers/trace-types'
const HEX_ZERO = '0x0'
const BN_ZERO = utils.toBN(HEX_ZERO)
const setInitialState = (web3, block, prevBlockNumber) => {
  return new Promise(resolve => {
    const state = {}
    state[block.miner.toLowerCase()] = BN_ZERO
    block.uncles.forEach(uncle => {
      state[uncle.miner.toLowerCase()] = BN_ZERO
    })
    block.transactions.forEach(tx => {
      state[tx.from.toLowerCase()] = BN_ZERO
      tx.trace.forEach(trace => {
        if (!trace.error) {
          if (trace.type === TraceTypes.CALL && trace.action.value !== HEX_ZERO) {
            state[trace.action.from] = BN_ZERO
            state[trace.action.to] = BN_ZERO
          } else if ((trace.type === TraceTypes.CREATE || trace.type === TraceTypes.CREATE2) && trace.action.value !== HEX_ZERO) {
            state[trace.action.from] = BN_ZERO
            state[trace.result.address] = BN_ZERO
          } else if (trace.type === TraceTypes.SUICIDE && trace.action.balance !== HEX_ZERO) {
            state[trace.action.address] = BN_ZERO
            state[trace.action.refundAddress] = BN_ZERO
          }
        }
      })
    })
    const addresses = Object.keys(state).map(address => {
      return address.toLowerCase()
    })
    getBatchEthBalance(addresses, prevBlockNumber, web3).then(balances => {
      balances.forEach((balance, idx) => {
        state[addresses[idx]] = utils.toBN(balance)
        resolve(state)
      })
    })
  })
}

class SetStateDiff {
  constructor(web3) {
    this.web3 = web3
  }

  set(block, verifyBalances = false) {
    return new Promise((resolve, reject) => {
      const prevBlockNum = block.number - 1
      const miner = block.miner.toLowerCase()
      setInitialState(this.web3, block, prevBlockNum).then(state => {
        const originalState = Object.assign({}, state)
        for (const tx of block.transactions) {
          tx.stateDiff = {}
          const stateCopy = Object.assign({}, state)
          const gasFee = utils.toBN(tx.gasUsed).mul(utils.toBN(tx.gasPrice))
          state[miner] = state[miner].add(gasFee)
          state[tx.from.toLowerCase()] = state[tx.from.toLowerCase()].sub(gasFee)
          const transfers = getValueTransfers(tx.trace)
          const suicidedAddresses = {}
          for (const transfer of transfers) {
            if (transfer.value !== HEX_ZERO) {
              state[transfer.from] = state[transfer.from].sub(utils.toBN(transfer.value))
              state[transfer.to] = state[transfer.to].add(utils.toBN(transfer.value))
              if (state[transfer.from].lt(BN_ZERO)) return reject(new Error('balance went below 0: ' + transfer.from + ' ' + block.number + ' ' + tx.hash))
            }
            if (transfer.type === TraceTypes.SUICIDE && transfer.value !== HEX_ZERO) {
              suicidedAddresses[transfer.from] = true
            }
          }
          for (const address in suicidedAddresses) {
            state[address] = BN_ZERO
          }
          for (const address in state) {
            if (!state[address].eq(stateCopy[address])) {
              tx.stateDiff[address] = {
                balance: {
                  '*': {
                    from: utils.toHex(stateCopy[address]),
                    to: utils.toHex(state[address])
                  }
                }
              }
            }
          }
        }
        const bP = new BlockProcessor(block)
        const changes = bP.getBalanceChangedAccounts()
        const addresses = Object.keys(changes)
        if (verifyBalances && addresses.length) {
          for (const address of addresses) {
            if (!utils.toBN(changes[address].from).eq(originalState[address])) return reject(new Error('balances dont match: previous:' + address))
          }
          getBatchEthBalance(addresses, block.number, this.web3).then(balances => {
            for (const [idx, balance] of balances.entries()) {
              if (!utils.toBN(changes[addresses[idx]].to).eq(utils.toBN(balance)))
                return reject(
                  new Error('balances dont match: destination:' + addresses[idx] + ' ' + balance + ' ' + block.number + ' ' + changes[addresses[idx]].to)
                )
            }
            resolve(block)
          })
        } else resolve(block)
      })
    })
  }
}

export default SetStateDiff
