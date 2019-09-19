import { UncleService } from '@app/dao/uncle.service'
import { ParseHashPipe } from '@app/shared/pipes/parse-hash.pipe'
import { Args, Query, Resolver } from '@nestjs/graphql'
import BigNumber from 'bignumber.js'
import { UncleDto } from '@app/graphql/uncles/dto/uncle.dto'
import { UnclePageDto } from '@app/graphql/uncles/dto/uncle-page.dto'
import { UseInterceptors } from '@nestjs/common'
import { SyncingInterceptor } from '@app/shared/interceptors/syncing-interceptor'
import {BlockNumberPipe} from '@app/shared/pipes/block-number.pipe';

@Resolver('Uncle')
@UseInterceptors(SyncingInterceptor)
export class UncleResolvers {
  constructor(private readonly uncleService: UncleService) { }

  /**
   * Get an uncle by its hash.
   * @param {string} hash - The uncle hash.
   * @param {BigNumber} [blockNumber=latest block number] - Any uncles with a block number higher than this will be ignored.
   * @returns {Promise<UncleDto | undefined>}
   */
  @Query()
  async uncleByHash(
    @Args('hash', ParseHashPipe) hash: string,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<UncleDto | undefined> {
    if (!blockNumber) { // No latest block number was found so there are no valid uncles.
      return undefined
    }
    const entity = await this.uncleService.findUncleByHash(hash, blockNumber)
    return entity ? new UncleDto(entity) : undefined
  }

  /**
   * Get a page of uncles.
   * @param {number} offset - The number of items to skip.
   * @param {number} limit - The page size.
   * @param {BigNumber} [blockNumber=latest block number] - Any uncles with a block number higher than this will be ignored.
   * @returns {Promise<UnclePageDto>} A page object with an array of uncles and the total number.
   */
  @Query()
  async uncles(
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<UnclePageDto> {
    if (!blockNumber) { // No latest block number was found so there are no valid uncles.
      return new UnclePageDto([], new BigNumber(0))
    }
    const [entities, count] = await this.uncleService.findUncles(offset, limit, blockNumber)
    return new UnclePageDto(entities, count)
  }

  // TODO confirm if this is still necessary
  /**
   * Get the block number of the latest uncle.
   * @param {BigNumber} [blockNumber=latest block number] - Any uncles with a block number higher than this will be ignored.
   * @returns {Promise<BigNumber>}
   */
  @Query()
  async latestUncleBlockNumber(@Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber): Promise<BigNumber> {
    if (!blockNumber) { // No latest block number was found so there are no valid uncles.
      return new BigNumber(0) // TODO change this to return undefined as 0 is a valid block number.
    }
    return await this.uncleService.findLatestUncleBlockNumber(blockNumber)
  }
}
