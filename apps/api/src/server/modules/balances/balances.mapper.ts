import { AddressBalance } from 'ethvm-common'

const toBalance = (a: any): AddressBalance => {
  a.amount = a.amount.toString()
  return a
}

export { toBalance }
