import { BigNumber, TokenExchangeRate } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { ContractDto } from '@app/graphql/contracts/dto/contract.dto'
import {TokenExchangeRateEntity} from '@app/orm/entities/token-exchange-rate.entity'

export class TokenExchangeRateDto implements TokenExchangeRate {

  address?: string
  symbol?: string
  name?: string
  image?: string
  currentPrice?: BigNumber
  marketCap?: BigNumber
  marketCapRank?: number
  totalVolume?: BigNumber
  high24h?: BigNumber
  low24h?: BigNumber
  priceChange24h?: BigNumber
  priceChangePercentage24h?: BigNumber
  marketCapChange24h?: BigNumber
  marketCapChangePercentage24h?: BigNumber
  circulatingSupply?: BigNumber
  totalSupply?: BigNumber
  lastUpdated?: string
  holdersCount?: BigNumber
  contract?: ContractDto

  constructor(data: TokenExchangeRateEntity, holdersCount?: BigNumber) {

    if (data.contract) {
      this.contract = new ContractDto(data.contract)
      delete data.contract
    }

    this.holdersCount = holdersCount

    assignClean(this, data)
  }
}
