import { utils } from 'web3'
import BlockProcessor from '../process-block'
import { getBatchEthBalance } from '../../helpers'

const getNumberOfErrorSkips = (traces, i) => {
  let tempSkips = traces[i].subtraces
  for (let j = i + 1; j <= i + tempSkips; j++) {
    if (traces[j].subtraces) {
      const skips = getNumberOfErrorSkips(traces, j)
      j += skips
      tempSkips += skips
    }
  }
  return tempSkips
}

const getValueTransfers = traces => {
  const transfers = []
  for (let i = 0; i < traces.length; i++) {
    if (traces[i].error) {
      const skips = getNumberOfErrorSkips(traces, i)
      i += skips
      continue
    } else {
      const trace = traces[i]
      if (trace.type === 'call') {
        transfers.push({
          from: trace.action.from,
          to: trace.action.to,
          value: trace.action.callType === 'call' ? trace.action.value : '0x0',
          type: 'call'
        })
      } else if (trace.type === 'create') {
        transfers.push({
          from: trace.action.from,
          to: trace.result.address,
          value: trace.action.value,
          type: 'create'
        })
      } else if (trace.type === 'suicide') {
        transfers.push({
          from: trace.action.address,
          to: trace.action.refundAddress,
          value: trace.action.balance,
          type: 'suicide'
        })
      }
      if (trace.type !== 'call' && trace.type !== 'create' && trace.type !== 'suicide' && trace.type !== 'staticcall')
        throw new Error('unknownTrace: ' + JSON.stringify(trace))
    }
  }
  return transfers
}

const setInitialState = (web3, block, prevBlockNumber) => {
  return new Promise(resolve => {
    const state = {}
    state[block.miner.toLowerCase()] = utils.toBN('0x0')
    block.uncles.forEach(uncle => {
      state[uncle.miner.toLowerCase()] = utils.toBN('0x0')
    })
    block.transactions.forEach(tx => {
      state[tx.from.toLowerCase()] = utils.toBN('0x0')
      tx.trace.forEach(trace => {
        if (!trace.error) {
          if (trace.type === 'call' && trace.action.value !== '0x0') {
            state[trace.action.from] = utils.toBN('0x0')
            state[trace.action.to] = utils.toBN('0x0')
          } else if (trace.type === 'create' && trace.action.value !== '0x0') {
            state[trace.action.from] = utils.toBN('0x0')
            state[trace.result.address] = utils.toBN('0x0')
          } else if (trace.type === 'suicide' && trace.action.balance !== '0x0') {
            state[trace.action.address] = utils.toBN('0x0')
            state[trace.action.refundAddress] = utils.toBN('0x0')
          }
          if (trace.type !== 'call' && trace.type !== 'create' && trace.type !== 'suicide' && trace.type !== 'staticcall')
            throw new Error('Unknown trace', trace)
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
    return new Promise(resolve => {
      const prevBlockNum = block.number - 1
      const miner = block.miner.toLowerCase()
      setInitialState(this.web3, block, prevBlockNum).then(state => {
        const originalState = Object.assign({}, state)
        block.transactions.forEach(tx => {
          tx.stateDiff = {}
          const stateCopy = Object.assign({}, state)
          const gasFee = utils.toBN(tx.gasUsed).mul(utils.toBN(tx.gasPrice))
          state[miner] = state[miner].add(gasFee)
          state[tx.from.toLowerCase()] = state[tx.from.toLowerCase()].sub(gasFee)
          const transfers = getValueTransfers(tx.trace)
          const suicidedAddresses = {}
          transfers.forEach(transfer => {
            if (transfer.value !== '0x0') {
              state[transfer.from] = state[transfer.from].sub(utils.toBN(transfer.value))
              state[transfer.to] = state[transfer.to].add(utils.toBN(transfer.value))
              if (state[transfer.from].lt(utils.toBN(0))) throw new Error('balance went below 0: ' + transfer.from + ' ' + block.number + ' ' + tx.hash)
            }
            if (transfer.type === 'suicide' && transfer.value !== '0x0') {
              suicidedAddresses[transfer.from] = true
            }
          })
          for (const address in suicidedAddresses) {
            state[address] = utils.toBN(0)
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
        })
        const bP = new BlockProcessor(block)
        const changes = bP.getBalanceChangedAccounts()
        const addresses = Object.keys(changes)
        if (verifyBalances && addresses.length) {
          addresses.forEach(address => {
            if (!utils.toBN(changes[address].from).eq(originalState[address])) throw new Error('balances dont match: previous:' + address)
          })
          getBatchEthBalance(addresses, block.number, this.web3).then(balances => {
            balances.forEach((balance, idx) => {
              if (!utils.toBN(changes[addresses[idx]].to).eq(utils.toBN(balance)))
                throw new Error('balances dont match: destination:' + addresses[idx] + ' ' + balance + ' ' + block.number + ' ' + changes[addresses[idx]].to)
            })
            resolve(block)
          })
        } else resolve(block)
      })
    })
  }
}

export default SetStateDiff
