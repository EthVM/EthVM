import { Account } from 'ethvm-common'

const toAccount = (a: any): Account => {
  const acc: any = {}
  if (a.address) {
    acc.address = a.address
  }
  if (a.balance) {
    acc.balance = parseFloat(a.balance)
  }
  if (a.nonce) {
    acc.nonce = a.nonce
  }
  if (a.contract) {
    acc.contract = a.contract
  }
  return acc
}

export { toAccount }
