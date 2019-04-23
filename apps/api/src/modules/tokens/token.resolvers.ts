import { Args, Query, Resolver } from '@nestjs/graphql'
import { TokenService } from '@app/modules/tokens/token.service'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'
import { ParseLimitPipe } from '@app/shared/validation/parse-limit.pipe'
import { ParsePagePipe } from '@app/shared/validation/parse-page.pipe'
import { TokenHolderDto } from '@app/modules/tokens/dto/token-holder.dto'
import { TokenExchangeRateDto } from '@app/modules/tokens/dto/token-exchange-rate.dto'

@Resolver('Token')
export class TokenResolvers {
  constructor(private readonly tokenService: TokenService) {
  }

  @Query()
  async tokenHolders(
    @Args('address', ParseAddressPipe) address: string,
    @Args('limit', ParseLimitPipe) limit: number,
    @Args('page', ParsePagePipe) page: number,
  ): Promise<TokenHolderDto[]> {
    const entities = await this.tokenService.findTokenHolders(address, limit, page)
    return (entities as any[]).map(e => new TokenHolderDto(e))
  }

  @Query()
  async tokenHolder(
    @Args('address', ParseAddressPipe) address: string,
    @Args('holderAddress', ParseAddressPipe) holderAddress: string,
  ): Promise<TokenHolderDto | null> {
    const entity = await this.tokenService.findTokenHolder(address, holderAddress)
    return entity ? new TokenHolderDto(entity) : null
  }

  @Query()
  async addressAllTokensOwned(@Args('address', ParseAddressPipe) address: string) {
    return this.tokenService.findAddressAllTokensOwned(address)
  }

  @Query()
  async addressAmountTokensOwned(@Args('address', ParseAddressPipe) address: string) {
    return this.tokenService.countTokensByHolderAddress(address)
  }

  @Query()
  async quote(@Args('symbol') symbol: string, @Args('to') to: string) {
    return await this.tokenService.findQuote(symbol, to)
  }

  @Query()
  async tokenExchangeRates(@Args('filter') filter: string, @Args('limit', ParseLimitPipe) limit?: number, @Args('page', ParsePagePipe) page?: number) {
    const entities = await this.tokenService.findTokenExchangeRates(filter, limit, page)
    return entities.map(e => new TokenExchangeRateDto(e))
  }

  @Query()
  async totalNumTokenExchangeRates() {
    return await this.tokenService.countTokenExchangeRates()
  }

  @Query()
  async tokenExchangeRateBySymbol(@Args('symbol') symbol: string) {
    const entity = await this.tokenService.findTokenExchangeRateBySymbol(symbol)
    return entity ? new TokenExchangeRateDto(entity) : null
  }

  @Query()
  async tokenExchangeRateByAddress(@Args('address', ParseAddressPipe) address: string) {
    const tokenExchangeRate = await this.tokenService.findTokenExchangeRateByAddress(address)
    if (!tokenExchangeRate) return null
    const contract = await this.tokenService.findContractInfoForToken(address)
    const holdersCount = await this.tokenService.countTokenHolders(address)
    return new TokenExchangeRateDto({ ...tokenExchangeRate, owner: contract? contract.creator : null, holdersCount })
  }
}
