import { TokenTransfer } from 'ethvm-common'

const toTokenTransfer = (t: any): TokenTransfer => {
  t.amount = Buffer.from(t.amount.bytes)
  return t
}

export { toTokenTransfer }
