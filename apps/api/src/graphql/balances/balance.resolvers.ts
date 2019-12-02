import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseInterceptors } from '@nestjs/common'
import { SyncingInterceptor } from '@app/shared/interceptors/syncing-interceptor'
import { ParseAddressesPipe } from '@app/shared/pipes/parse-addresses.pipe'
import { BalanceService } from '@app/dao/balance.service'
import { BalancePageDto } from '@app/graphql/balances/dto/balance-page.dto'
import BigNumber from 'bignumber.js'
import {BlockNumberPipe} from '@app/shared/pipes/block-number.pipe'
import {RawBalanceEntity} from '@app/graphql/balances/dto/balance.dto';

@Resolver('Balance')
@UseInterceptors(SyncingInterceptor)
export class BalanceResolvers {

  constructor(private readonly balanceService: BalanceService) {
  }

  /**
   * Get a page of balances.
   * @param {string[]} addresses - The addresses to find balances for.
   * @param {BigNumber} [blockNumber=latest block number] - Any balance entries with a block number higher than this will be ignored.
   * @param {string[]} [contracts] - The contract addresses to find balances for.
   * @param {number} [offset] - The number of items to skip.
   * @param {number} [limit] - The page size.
   * @returns {Promise<BalancePageDto>} A page object with an array of balances and a boolean indicating whether there are more balances after these.
   */
  @Query()
  async balances(
    @Args({name: 'addresses', type: () => [String]}, ParseAddressesPipe) addresses: string[],
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
    @Args({name: 'contracts', type: () => [String]}, ParseAddressesPipe) contracts?: string[],
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<BalancePageDto> {

    if (!blockNumber) { // No latest block number was found so there are no valid balances.
      return new BalancePageDto([], false)
    }

    const [items, hasMore] = await this.balanceService.find(addresses, blockNumber, contracts, offset, limit)
    return new BalancePageDto(items, hasMore)
  }
}
