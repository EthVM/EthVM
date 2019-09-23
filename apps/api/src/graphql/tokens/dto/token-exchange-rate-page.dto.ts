import {TokenExchangeRatesPage} from '@app/graphql/schema'
import {TokenExchangeRateDto} from '@app/graphql/tokens/dto/token-exchange-rate.dto'
import {TokenExchangeRateEntity} from '@app/orm/entities/token-exchange-rate.entity'

export class TokenExchangeRatePageDto implements TokenExchangeRatesPage {
  items!: TokenExchangeRateDto[]
  totalCount!: number

  constructor(items: TokenExchangeRateEntity[], totalCount: number) {
    this.items = items.map(i => new TokenExchangeRateDto(i))
    this.totalCount = totalCount
  }
}
