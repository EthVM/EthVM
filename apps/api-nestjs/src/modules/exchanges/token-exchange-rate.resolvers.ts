import { Args, Query, Resolver } from '@nestjs/graphql'
import { ExchangeService } from '@app/modules/exchanges/exchange.service'
import { TokenExchangeRateDto } from '@app/modules/exchanges/token-exchange-rate.dto'

@Resolver('TokenExchangeRate')
export class TokenExchangeRateResolvers {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Query()
  async quote(@Args('token') token: string, @Args('to') to: string) {
    return await this.exchangeService.findQuote(token, to)
  }

  @Query()
  async tokenExchangeRates(@Args('filter') filter: string, @Args('limit') limit: number, @Args('page') page: number) {
    const entities = await this.exchangeService.findTokenExchangeRates(filter, limit, page)
    return entities.map(e => new TokenExchangeRateDto(e))
  }

  @Query()
  async totalNumTokenExchangeRates() {
    return await this.exchangeService.countTokenExchangeRates()
  }

  @Query()
  async tokenExchangeRateBySymbol(@Args('symbol') symbol: string) {
    const entity = await this.exchangeService.findTokenExchangeRateBySymbol(symbol)
    return entity ? new TokenExchangeRateDto(entity) : null
  }

  @Query()
  async tokenExchangeRateByAddress(@Args('address') address: string) {
    const entity = await this.exchangeService.findTokenExchangeRateByAddress(address)
    return entity ? new TokenExchangeRateDto(entity) : null
  }
}
