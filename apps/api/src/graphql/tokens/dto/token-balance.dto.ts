import { BigNumber, TokenBalance } from '@app/graphql/schema'
import { assignClean, extractFromJson } from '@app/shared/utils'
import { Erc20BalanceEntity } from '@app/orm/entities/erc20-balance.entity'

export class TokenBalanceDto implements TokenBalance {

  name?: string
  website?: string
  email?: string
  symbol?: string
  address?: string
  decimals?: number
  balance?: BigNumber
  currentPrice?: BigNumber
  priceChangePercentage24h?: BigNumber
  image?: string

  constructor(data: Erc20BalanceEntity) {
    assignClean(this, data)

    this.balance = data.amount

    const { tokenExchangeRate, metadata, contractMetadata } = data

    if (contractMetadata) {
      this.name = contractMetadata.name
      this.website = contractMetadata.website
      this.email = extractFromJson('email', contractMetadata.support)
      this.symbol = contractMetadata.symbol
      this.decimals = contractMetadata.decimals
      this.image = extractFromJson('src', contractMetadata.logo)
    }

    if (metadata) {
      this.name = this.name || metadata.name
      this.symbol = this.symbol || metadata.symbol
      this.decimals = this.decimals || metadata.decimals
    }

    if (tokenExchangeRate) {
      this.currentPrice = tokenExchangeRate.currentPrice
      this.priceChangePercentage24h = tokenExchangeRate.priceChangePercentage24h
      this.image = this.image || tokenExchangeRate.image
    }

  }
}
