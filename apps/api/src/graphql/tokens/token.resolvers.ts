import { Args, Query, Resolver } from '@nestjs/graphql'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'
import { TokenService } from '@app/dao/token.service'
import { TokenHolderDto } from '@app/graphql/tokens/dto/token-holder.dto'
import { TokenExchangeRateDto } from '@app/graphql/tokens/dto/token-exchange-rate.dto'
import { TokenMetadataDto } from '@app/graphql/tokens/dto/token-metadata.dto'
import { TokenHoldersPageDto } from '@app/graphql/tokens/dto/token-holders-page.dto'
import { TokenPageDto } from '@app/graphql/tokens/dto/token-page.dto'
import BigNumber from 'bignumber.js'
import { TokenExchangeRatePageDto } from '@app/graphql/tokens/dto/token-exchange-rate-page.dto'
import { CoinExchangeRateDto } from '@app/graphql/tokens/dto/coin-exchange-rate.dto'
import { UseInterceptors } from '@nestjs/common'
import { SyncingInterceptor } from '@app/shared/interceptors/syncing-interceptor'
import { TokenDetailDto } from '@app/graphql/tokens/dto/token-detail.dto'

@Resolver('Token')
@UseInterceptors(SyncingInterceptor)
export class TokenResolvers {
  constructor(private readonly tokenService: TokenService) {
  }

  @Query()
  async tokenHolders(
    @Args('address', ParseAddressPipe) address: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ): Promise<TokenHoldersPageDto> {
    const result = await this.tokenService.findTokenHolders(address, limit, offset)
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
  async addressAllTokensOwned(
    @Args('address', ParseAddressPipe) address: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ): Promise<TokenPageDto> {
    const [tokens, totalCount] = await this.tokenService.findAddressAllTokensOwned(address, offset, limit)
    return new TokenPageDto({items: tokens, totalCount})
  }

  @Query()
  async addressTotalTokenValueUSD(
    @Args('address', ParseAddressPipe) address: string,
  ): Promise<BigNumber | undefined> {
    return this.tokenService.totalValueUSDByAddress(address)
  }

  @Query()
  async coinExchangeRate(@Args('pair') pair: string): Promise<CoinExchangeRateDto | undefined> {
    const entity = await this.tokenService.findCoinExchangeRate(pair)
    return entity ? new CoinExchangeRateDto(entity) : undefined
  }

  @Query()
  async tokenExchangeRates(
    @Args({ name: 'symbols', type: () => [String] }) symbols: string[],
    @Args('sort') sort: string,
    @Args('limit') limit: number,
    @Args('offset') offset: number,
  ): Promise<TokenExchangeRatePageDto> {
    const [items, totalCount] = await this.tokenService.findTokenExchangeRates(sort, limit, offset, symbols)
    return new TokenExchangeRatePageDto({ items, totalCount })
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
    const holdersCount = await this.tokenService.countTokenHolders(address)
    return new TokenExchangeRateDto({...tokenExchangeRate, holdersCount})
  }

  @Query()
  async tokensMetadata(@Args({name: 'symbols', type: () => [String]}) symbols: string[]): Promise<TokenMetadataDto[]> {
    return await this.tokenService.findTokensMetadata(symbols)
  }

  @Query()
  async tokenDetailByAddress(@Args('address', ParseAddressPipe) address: string): Promise<TokenDetailDto | undefined> {
    const entity = await this.tokenService.findDetailByAddress(address)
    if (!entity) return undefined
    const holdersCount = await this.tokenService.countTokenHolders(address)
    return new TokenDetailDto({...entity, holdersCount})
  }
}
