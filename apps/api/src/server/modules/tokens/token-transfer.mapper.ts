import { TokenTransfer } from 'ethvm-common'

const toTokenTransfer = (t: any): TokenTransfer => {
  t.amount = t.amount.bytes
  return t
}

export { toTokenTransfer }
