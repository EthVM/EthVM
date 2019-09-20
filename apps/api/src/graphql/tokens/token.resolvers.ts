import {Args, Query, Resolver} from '@nestjs/graphql'
import {ParseAddressPipe} from '@app/shared/pipes/parse-address.pipe'
import {TokenService} from '@app/dao/token.service'
import {TokenHolderDto} from '@app/graphql/tokens/dto/token-holder.dto'
import {TokenExchangeRateDto} from '@app/graphql/tokens/dto/token-exchange-rate.dto'
import {TokenHoldersPageDto} from '@app/graphql/tokens/dto/token-holders-page.dto'
import BigNumber from 'bignumber.js'
import {TokenExchangeRatePageDto} from '@app/graphql/tokens/dto/token-exchange-rate-page.dto'
import {CoinExchangeRateDto} from '@app/graphql/tokens/dto/coin-exchange-rate.dto'
import {UseInterceptors} from '@nestjs/common'
import {SyncingInterceptor} from '@app/shared/interceptors/syncing-interceptor'
import {TokenMetadataPageDto} from '@app/graphql/tokens/dto/token-metadata-page.dto'
import {TokenDetailDto} from '@app/graphql/tokens/dto/token-detail.dto'
import {TokenBalancePageDto} from '@app/graphql/tokens/dto/token-balance-page.dto'
import {BlockNumberPipe} from '@app/shared/pipes/block-number.pipe'
import {ExchangeRatePair, TokenExchangeRateFilter} from '@app/graphql/schema'

@Resolver('Token')
@UseInterceptors(SyncingInterceptor)
export class TokenResolvers {
  constructor(private readonly tokenService: TokenService) {
  }

  /**
   * Get a page of holders (accounts with positive balances) of a given token.
   * @param {string} address - Address hash of the token.
   * @param {number} offset - The number of items to skip.
   * @param {number} limit - The page size.
   * @param {BigNumber} [blockNumber=latest block number] - The block number at which to find positive token balances.
   * @returns {Promise<TokenHoldersPageDto>} A page object with an array of token holders, a boolean representing whether there are more items after these, and
   * the total count of holders of this token at this block number.
   */
  @Query()
  async tokenHolders(
    @Args('address', ParseAddressPipe) address: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<TokenHoldersPageDto> {
    if (!blockNumber) { // No latest block number was found so there are no token balances.
      return new TokenHoldersPageDto({ items: [], hasMore: false, totalCount: 0 })
    }
    const [items, hasMore, totalCount] = await this.tokenService.findAllTokenBalancesForContract(address, limit, offset, blockNumber)
    return new TokenHoldersPageDto({ items, hasMore, totalCount })
  }

  /**
   * Get the balance of a token holder
   * @param {string} address - The address of the contract (token).
   * @param {string} holderAddress - The address of the token holder.
   * @param {BigNumber} [blockNumber=latest block number] - The block number at which to find the token balance for this holder.
   * @returns {Promise<TokenHolderDto | undefined>} An object containing the holder address and token balance.
   */
  @Query()
  async tokenHolder(
    @Args('address', ParseAddressPipe) address: string,
    @Args('holderAddress', ParseAddressPipe) holderAddress: string,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<TokenHolderDto | undefined> {
    if (!blockNumber) { // No latest block number was found so there are no token balances.
      return undefined
    }
    const entity = await this.tokenService.findTokenBalance(address, holderAddress, blockNumber)
    return entity ? new TokenHolderDto(entity) : undefined
  }

  /**
   * Get all token balances (not Ether) for a given address. Currently this only returns ERC20 balances.
   * @param {string} address - The holder address
   * @param {number} offset - The number of items to skip.
   * @param {number} limit - The page size.
   * @param {BigNumber} [blockNumber=latest block number] - The block number at which to find positive token balances.
   * @returns {Promise<TokenBalancePageDto>} A page object with an array of token balances, a boolean representing whether there are more items after these and
   * the total count of positive token balances for this holder at this block number (excluding Ether balance)
   */
  @Query()
  async addressAllTokensOwned(
    @Args('address', ParseAddressPipe) address: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<TokenBalancePageDto> {
    if (!blockNumber) { // No latest block number was found so there are no token balances.
      return new TokenBalancePageDto({ items: [], hasMore: false, totalCount: 0 })
    }
    const [items, hasMore, totalCount] = await this.tokenService.findAllTokenBalancesForAddress(address, offset, limit, blockNumber)
    return new TokenBalancePageDto({ items, hasMore, totalCount })
  }

  /**
   * Get the total USD value of all ERC20 tokens held by a given address.
   * @param {string} address - The holder address.
   * @param {BigNumber} [blockNumber=latest block number] - The block number at which to calculate the total USD value.
   * @returns {Promise<BigNumber | undefined>} The total USD value of all ERC20 tokens held.
   */
  @Query()
  async addressTotalTokenValueUSD(
    @Args('address', ParseAddressPipe) address: string,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<BigNumber | undefined> {
    if (!blockNumber) { // No latest block number was found so there are no token balances.
      return undefined
    }
    return this.tokenService.totalValueUSDByAddress(address, blockNumber)
  }

  /**
   * Get a coin exchange rate e.g. (ethereum to usd).
   * @param {ExchangeRatePair} pair - The pair of coins to get the exchange rate for e.g. ethereum_usd.
   * @returns {Promise<CoinExchangeRateDto | undefined>} An object with the price of the exchange rate and other useful info.
   */
  @Query()
  async coinExchangeRate(@Args('pair') pair: ExchangeRatePair): Promise<CoinExchangeRateDto | undefined> {
    const entity = await this.tokenService.findCoinExchangeRate(pair)
    return entity ? new CoinExchangeRateDto(entity) : undefined
  }

  /**
   * Get a page of token exchange rates.
   * @param {string[]} [addresses] - Optional array of contract (token) addresses to filter by.
   * @param {TokenExchangeRateFilter} [sort] - The sort field and direction.
   * @param {number} [offset] - The number of items to skip.
   * @param {number} [limit] - The page size.
   * @returns {Promise<TokenExchangeRatePageDto>} A page object with an array of token exchange rates and the total count.
   */
  @Query()
  async tokenExchangeRates(
    @Args({ name: 'addresses', type: () => [String], nullable: true }) addresses?: string[],
    @Args('sort') sort?: TokenExchangeRateFilter,
    @Args('limit') limit?: number,
    @Args('offset') offset?: number,
  ): Promise<TokenExchangeRatePageDto> {
    const [items, totalCount] = await this.tokenService.findTokenExchangeRates(sort, limit, offset, addresses)
    return new TokenExchangeRatePageDto({ items, totalCount })
  }

  /**
   * Get the total number of token exchange rates
   * @returns {Promise<number>}
   */
  @Query()
  async totalNumTokenExchangeRates(): Promise<number> {
    return await this.tokenService.countTokenExchangeRates()
  }

  /**
   * Get a token exchange rate by its symbol
   * @param {string} symbol - The symbol to search by.
   * @returns {Promise<TokenExchangeRateDto | undefined>}
   */
  @Query()
  async tokenExchangeRateBySymbol(@Args('symbol') symbol: string): Promise<TokenExchangeRateDto | undefined> {
    const entity = await this.tokenService.findTokenExchangeRateBySymbol(symbol)
    return entity ? new TokenExchangeRateDto(entity) : undefined
  }

  /**
   * Get a token exchange rate by a contract address, with the total number of holders.
   * @param {string} address - The address hash of the (ERC20 token) contract.
   * @param {BigNumber} [blockNumber=latest block number] - The block number at which to find the total number of token holders.
   * @returns {Promise<TokenExchangeRateDto | undefined>} An object with exchange rate info and the number of holders of this token.
   */
  @Query()
  async tokenExchangeRateByAddress(
    @Args('address', ParseAddressPipe) address: string,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<TokenExchangeRateDto | undefined> {
    if (!blockNumber) { // No latest block number was found so there are no tokens.
      return undefined
    }
    // Find a token exchange rate with this address.
    const tokenExchangeRate = await this.tokenService.findTokenExchangeRateByAddress(address)
    if (!tokenExchangeRate) return undefined

    // Find the total number of holders of this token as of this block number.
    const holdersCount = await this.tokenService.countTokenHolders(address, blockNumber)

    return new TokenExchangeRateDto({...tokenExchangeRate, holdersCount})
  }

  /**
   * Get a page of token metadata.
   * @param {string[]} [addresses] - Optional array of addresses by which to filter token metadata.
   * @param {number} [offset] - The number of items to skip.
   * @param {number} [limit] - The page size.
   * @returns {Promise<TokenMetadataPageDto>} A page object with an array of token metadata and a boolean representing whether there are more items.
   */
  @Query()
  async tokensMetadata(
    @Args({ name: 'addresses', type: () => [String], nullable: true }) addresses?: string[],
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<TokenMetadataPageDto> {
    const [items, hasMore] = await this.tokenService.findTokenMetadata(addresses, offset, limit)
    return new TokenMetadataPageDto({ items, hasMore })
  }

  /**
   * Get token details for a given contract address, including the total number of token holders.
   * @param {string} address - The address to find token details for.
   * @param {BigNumber} [blockNumber=latest block number] - The block number at which to find the total number of token holders.
   * @returns {Promise<TokenDetailDto | undefined>}
   */
  @Query()
  async tokenDetailByAddress(
    @Args('address', ParseAddressPipe) address: string,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<TokenDetailDto | undefined> {
    if (!blockNumber) { // No latest block number was found so there are no tokens.
      return undefined
    }
    const entity = await this.tokenService.findDetailByAddress(address, blockNumber)
    if (!entity) return undefined

    // Find total number of holders of this token at the given block number.
    const holdersCount = await this.tokenService.countTokenHolders(address, blockNumber)

    return new TokenDetailDto({...entity, holdersCount})
  }
}
