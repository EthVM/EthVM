import { utils } from 'web3'
import Configs from '../../configs'
import { CalculateReward } from '../save-to-db'

const getBalanceChange = diff => {
  if (diff['*']) {
    return {
      from: utils.toBN(diff['*'].from),
      to: utils.toBN(diff['*'].to)
    }
  } else if (diff['+']) {
    return {
      from: utils.toBN('0x0'),
      to: utils.toBN(diff['+'])
    }
  } else if (diff['-']) {
    return {
      to: utils.toBN('0x0'),
      from: utils.toBN(diff['-'])
    }
  }
}

const setBalanceChanges = (account, newBalance) => {
  account.to = utils.toHex(newBalance)
  account.diff = utils.toHex(utils.toBN(account.to).sub(utils.toBN(account.from)))
}

const cleanZeroBalances = changedBalances => {
  for (const address in changedBalances) {
    if (changedBalances[address].from === '0x0' && changedBalances[address].to === '0x0') {
      delete changedBalances[address]
    }
  }
  return changedBalances
}

class BlockProcessor {
  constructor(block) {
    const _calcReward = new CalculateReward(Configs.CHAIN)
    this.block = _calcReward.setSync(block)
  }

  getTransactions(includeStateDiff = false, includeTrace = false) {
    const _block = Object.assign({}, this.block)
    if (includeStateDiff && includeTrace) return _block.transactions
    else {
      _block.transactions.forEach(_tx => {
        if (!includeStateDiff) delete _tx.stateDiff
        if (!includeTrace) delete _tx.trace
      })
      return _block.transactions
    }
  }

  getBalanceChangedAccounts() {
    const changedAccounts = {}
    const _txs = this.block.transactions
    const miner = this.block.miner.toLowerCase()
    let totalTxFee = utils.toBN('0x0')
    _txs.forEach(_tx => {
      const txFee = utils.toBN(_tx.gasPrice).mul(utils.toBN(_tx.gasUsed))
      totalTxFee = totalTxFee.add(txFee)
      for (const address in _tx.stateDiff) {
        if (_tx.stateDiff[address].balance['*'] || _tx.stateDiff[address].balance['+'] || _tx.stateDiff[address].balance['-']) {
          const change = getBalanceChange(_tx.stateDiff[address].balance)
          if (changedAccounts[address]) {
            setBalanceChanges(changedAccounts[address], change.to)
          } else {
            changedAccounts[address] = {
              from: utils.toHex(change.from)
            }
            setBalanceChanges(changedAccounts[address], change.to)
          }
        }
      }
    })
    const _uncles = this.block.uncles
    _uncles.forEach(_uncle => {
      const uncleMiner = _uncle.miner.toLowerCase()
      if (!changedAccounts[uncleMiner]) {
        changedAccounts[uncleMiner] = {
          from: _uncle.minerBalance.from,
          to: _uncle.minerBalance.from
        }
      }
      setBalanceChanges(changedAccounts[uncleMiner], utils.toBN(_uncle.reward).add(utils.toBN(changedAccounts[uncleMiner].to)))
    })
    if (!changedAccounts[miner]) {
      changedAccounts[miner] = {
        from: this.block.minerBalance.from,
        to: this.block.minerBalance.from
      }
    }
    setBalanceChanges(
      changedAccounts[miner],
      utils
        .toBN(changedAccounts[miner].to)
        .add(utils.toBN(this.block.rewards.base))
        .add(utils.toBN(this.block.rewards.uncles))
    )
    cleanZeroBalances(changedAccounts)
    return changedAccounts
  }
}

export default BlockProcessor
