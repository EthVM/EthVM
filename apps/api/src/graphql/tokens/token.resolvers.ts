import { Args, Query, Resolver } from '@nestjs/graphql'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'
import { TokenService } from '@app/dao/token.service'
import { TokenHolderDto } from '@app/graphql/tokens/dto/token-holder.dto'
import { TokenExchangeRateDto } from '@app/graphql/tokens/dto/token-exchange-rate.dto'
import { TokenHoldersPageDto } from '@app/graphql/tokens/dto/token-holders-page.dto'
import BigNumber from 'bignumber.js'
import { TokenExchangeRatePageDto } from '@app/graphql/tokens/dto/token-exchange-rate-page.dto'
import { CoinExchangeRateDto } from '@app/graphql/tokens/dto/coin-exchange-rate.dto'
import { UseInterceptors } from '@nestjs/common'
import { SyncingInterceptor } from '@app/shared/interceptors/syncing-interceptor'
import { TokenMetadataPageDto } from '@app/graphql/tokens/dto/token-metadata-page.dto'
import { TokenDetailDto } from '@app/graphql/tokens/dto/token-detail.dto'
import { TokenBalancePageDto } from '@app/graphql/tokens/dto/token-balance-page.dto'

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
  ): Promise<TokenBalancePageDto> {
    const [items, hasMore] = await this.tokenService.findAddressAllErc20TokensOwned(address, offset, limit)
    return new TokenBalancePageDto({items, hasMore})
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
    @Args({ name: 'addresses', type: () => [String], nullable: true }) addresses?: string[],
    @Args('sort') sort?: string,
    @Args('limit') limit?: number,
    @Args('offset') offset?: number,
  ): Promise<TokenExchangeRatePageDto> {
    const [items, hasMore] = await this.tokenService.findTokenExchangeRates(sort, limit, offset, addresses)
    return new TokenExchangeRatePageDto({ items, hasMore })
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
  async tokensMetadata(
    @Args({ name: 'addresses', type: () => [String], nullable: true }) addresses?: string[],
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<TokenMetadataPageDto> {
    const [items, totalCount] = await this.tokenService.findTokensMetadata(addresses, offset, limit)
    return new TokenMetadataPageDto({ items, totalCount })
  }

  @Query()
  async tokenDetailByAddress(@Args('address', ParseAddressPipe) address: string): Promise<TokenDetailDto | undefined> {
    const entity = await this.tokenService.findDetailByAddress(address)
    if (!entity) return undefined
    const holdersCount = await this.tokenService.countTokenHolders(address)
    return new TokenDetailDto({...entity, holdersCount})
  }
}
