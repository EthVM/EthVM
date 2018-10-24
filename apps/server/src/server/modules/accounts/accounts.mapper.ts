import { Account } from 'ethvm-models'

const toAccount = (a: any): Account => {
  const acc: any = {}
  if (a.address) {
    acc.address = a.address
  }
  if (a.balance) {
    acc.balance = a.balance.buffer
  }
  if (a.nonce) {
    acc.nonce = a.nonce.buffer
  }
  if (a.contract) {
    acc.contract = a.contract
  }
  return acc
}

export { toAccount }
