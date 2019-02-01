import { TokenTransfer, TokenExchangeRate } from 'ethvm-common'

const toTokenTransfer = (t: any): TokenTransfer => {
  t.amount = Buffer.from(t.amount.bytes)
  return t
}

const toTokenExchangeRate = (t: any): TokenExchangeRate => {
  return t
}

export { toTokenTransfer, toTokenExchangeRate }
