import { AddressBalance } from 'ethvm-common'

const toBalance = (a: any): AddressBalance => {
  a.amount = Buffer.from(a.amount.bytes)
  return a
}

export { toBalance }
