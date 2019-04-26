import { Args, Query, Resolver } from '@nestjs/graphql'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'
import { ParsePagePipe } from '@app/shared/validation/parse-page.pipe'
import { TokenHoldersPageDto } from '@app/modules/tokens/dto/token-holders-page.dto'
import { TokensMetadataArgs } from '@app/modules/tokens/args/tokens-metadata.args'
import {TokenService} from '@app/dao/token.service'
import {TokenHolderDto} from '@app/graphql/tokens/dto/token-holder.dto'
import {TokenExchangeRateDto} from '@app/graphql/tokens/dto/token-exchange-rate.dto'
import {TokenMetadataDto} from '@app/graphql/tokens/dto/token-metadata.dto'
import {ParseLimitPipe} from '@app/shared/validation/parse-limit.pipe.1'

@Resolver('Token')
export class TokenResolvers {
  constructor(private readonly tokenService: TokenService) {
  }

  @Query()
  async tokenHolders(
    @Args('address', ParseAddressPipe) address: string,
    @Args('limit', ParseLimitPipe) limit: number,
    @Args('page', ParsePagePipe) page: number,
  ): Promise<TokenHoldersPageDto> {
    const result = await this.tokenService.findTokenHolders(address, limit, page)
    return new TokenHoldersPageDto({
      items: result[0],
      totalCount: result[1],
    })
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
  async coinExchangeRate(@Args('pair') pair: string) {
    return await this.tokenService.findCoinExchangeRate(pair)
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
    return new TokenExchangeRateDto({ ...tokenExchangeRate, owner: contract ? contract.creator : null, holdersCount })
  }

  @Query()
  async tokensMetadata(@Args() {symbols}: TokensMetadataArgs): Promise<TokenMetadataDto[]> {
    return await this.tokenService.findTokensMetadata(symbols)
  }
}
