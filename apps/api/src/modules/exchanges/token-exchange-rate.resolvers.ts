import { Args, Query, Resolver } from '@nestjs/graphql'
import { ExchangeService } from '@app/modules/exchanges/exchange.service'
import { TokenExchangeRateDto } from '@app/modules/exchanges/token-exchange-rate.dto'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'
import { ParseLimitPipe } from '@app/shared/validation/parse-limit.pipe'
import { ParsePagePipe } from '@app/shared/validation/parse-page.pipe'
import { TokenTransferService } from '@app/modules/token-transfers/token-transfer.service'

@Resolver('TokenExchangeRate')
export class TokenExchangeRateResolvers {
  constructor(private readonly exchangeService: ExchangeService, private readonly tokenTransferService: TokenTransferService) {}

  @Query()
  async quote(@Args('symbol') symbol: string, @Args('to') to: string) {
    return await this.exchangeService.findQuote(symbol, to)
  }

  @Query()
  async tokenExchangeRates(@Args('filter') filter: string, @Args('limit', ParseLimitPipe) limit: number, @Args('page', ParsePagePipe) page: number) {
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
  async tokenExchangeRateByAddress(@Args('address', ParseAddressPipe) address: string) {
    const entity = await this.exchangeService.findTokenExchangeRateByAddress(address)
    // Get missing info (owner, holdersCount) from Ethplorer API
    const tokenInfo = await this.tokenTransferService.fetchTokenInfo(address)
    const combined = { ...entity, ...tokenInfo }
    return combined ? new TokenExchangeRateDto(combined) : null
  }
}
