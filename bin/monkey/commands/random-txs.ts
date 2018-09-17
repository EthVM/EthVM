import * as utils from 'web3-utils'
import accountsData from '../accounts.json'
import { estimateGas, sendTransaction, TxParams } from '../shared'

const { accounts } = accountsData

export async function randomTxsCommand(count: number) {
  let i = 0
  while (i < count) {
    const to = Math.floor(Math.random() * (accounts.length - 1))
    const from = Math.floor(Math.random() * (accounts.length - 1))

    // Double check we're not sending to the same address
    if (from === to) {
      continue
    }

    const toAccount = accounts[to]
    const fromAccount = accounts[from]

    const params: TxParams = {
      to: toAccount.address,
      from: fromAccount.address,
      value: utils.numberToHex(Math.ceil(Math.random() * 1000) + 1),
      gasPrice: '0x430E23400'
    }

    params.gas = await estimateGas(params)
    await sendTransaction(params, fromAccount.key)

    i++
  }
}
