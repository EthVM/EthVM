import { Args, Query, Resolver } from '@nestjs/graphql'
import { ParseAddressPipe } from '@app/shared/pipes/parse-address.pipe'
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
import {BlockNumberPipe} from '@app/shared/pipes/block-number.pipe';

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
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<TokenHoldersPageDto> {
    const [items, hasMore] = await this.tokenService.findAllTokenBalancesForContract(address, limit, offset, blockNumber)
    return new TokenHoldersPageDto({ items, hasMore })
  }

  @Query()
  async tokenHolder(
    @Args('address', ParseAddressPipe) address: string,
    @Args('holderAddress', ParseAddressPipe) holderAddress: string,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<TokenHolderDto | null> {
    const entity = await this.tokenService.findTokenBalance(address, holderAddress, blockNumber)
    return entity ? new TokenHolderDto(entity) : null
  }

  @Query()
  async addressAllTokensOwned(
    @Args('address', ParseAddressPipe) address: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<TokenBalancePageDto> {
    const [items, hasMore] = await this.tokenService.findAllTokenBalancesForAddress(address, offset, limit, blockNumber)
    return new TokenBalancePageDto({items, hasMore})
  }

  @Query()
  async addressTotalTokenValueUSD(
    @Args('address', ParseAddressPipe) address: string,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<BigNumber | undefined> {
    return this.tokenService.totalValueUSDByAddress(address, blockNumber)
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
  async tokenExchangeRateByAddress(
    @Args('address', ParseAddressPipe) address: string,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<TokenExchangeRateDto | undefined> {
    const tokenExchangeRate = await this.tokenService.findTokenExchangeRateByAddress(address)
    if (!tokenExchangeRate) return undefined
    const holdersCount = await this.tokenService.countTokenHolders(address, blockNumber)
    return new TokenExchangeRateDto({...tokenExchangeRate, holdersCount})
  }

  @Query()
  async tokensMetadata(
    @Args({ name: 'addresses', type: () => [String], nullable: true }) addresses?: string[],
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<TokenMetadataPageDto> {
    const [items, hasMore] = await this.tokenService.findTokenMetadata(addresses, offset, limit)
    return new TokenMetadataPageDto({ items, hasMore })
  }

  @Query()
  async tokenDetailByAddress(
    @Args('address', ParseAddressPipe) address: string,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<TokenDetailDto | undefined> {
    const entity = await this.tokenService.findDetailByAddress(address)
    if (!entity) return undefined
    const holdersCount = await this.tokenService.countTokenHolders(address, blockNumber)
    return new TokenDetailDto({...entity, holdersCount})
  }
}
