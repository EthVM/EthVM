import { TokenExchangeRatesPage } from '@app/graphql/schema'
import { assignClean } from '@app/shared/utils'
import { TokenExchangeRateDto } from '@app/graphql/tokens/dto/token-exchange-rate.dto'

export class TokenExchangeRatePageDto implements TokenExchangeRatesPage {
  items!: TokenExchangeRateDto[]
  hasMore!: boolean

  constructor(data: any) {
    if (data.items) {
      this.items = data.items.map(i => new TokenExchangeRateDto(i))
      delete data.items
    }
    assignClean(this, data)
  }
}
