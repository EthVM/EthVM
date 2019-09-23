import { BigNumber, TokenBalance } from '@app/graphql/schema'
import { assignClean, extractFromJson } from '@app/shared/utils'
import {RawBalanceEntity} from '@app/graphql/balances/dto/balance.dto'

export class TokenBalanceDto implements TokenBalance {

  name?: string
  website?: string
  email?: string
  symbol?: string
  contractAddress?: string
  holderAddress?: string
  decimals?: number
  balance?: BigNumber
  currentPrice?: BigNumber
  priceChangePercentage24h?: BigNumber
  image?: string

  constructor(data: RawBalanceEntity) {
    assignClean(this, data)

    this.balance = data.balance
    this.contractAddress = data.contract_address
    this.holderAddress = data.address

    const { tokenExchangeRate, contractMetadata, ethListContractMetadata } = data

    if (ethListContractMetadata) {
      this.name = ethListContractMetadata.name
      this.website = ethListContractMetadata.website
      this.email = extractFromJson('email', ethListContractMetadata.support)
      this.symbol = ethListContractMetadata.symbol
      this.decimals = ethListContractMetadata.decimals
      this.image = extractFromJson('src', ethListContractMetadata.logo)
    }

    if (contractMetadata) {
      this.name = this.name || contractMetadata.name
      this.symbol = this.symbol || contractMetadata.symbol
      this.decimals = this.decimals || contractMetadata.decimals
    }

    if (tokenExchangeRate) {
      this.currentPrice = tokenExchangeRate.currentPrice
      this.priceChangePercentage24h = tokenExchangeRate.priceChangePercentage24h
      this.image = this.image || tokenExchangeRate.image
    }

  }
}
