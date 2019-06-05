import { BigNumber, Token } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'

export class TokenDto implements Token {

  name?: string
  website?: string
  email?: string
  symbol?: string
  address?: string
  decimals?: number
  balance?: BigNumber
  currentPrice?: BigNumber
  priceChange24h?: BigNumber

  constructor(data: any) {
    assignClean(this, data)
  }
}
