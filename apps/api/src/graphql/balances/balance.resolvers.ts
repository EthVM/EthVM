import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseInterceptors } from '@nestjs/common'
import { SyncingInterceptor } from '@app/shared/interceptors/syncing-interceptor'
import { ParseAddressesPipe } from '@app/shared/pipes/parse-addresses.pipe'
import { BalanceService } from '@app/dao/balance.service'
import { BalancePageDto } from '@app/graphql/balances/dto/balance-page.dto'
import BigNumber from 'bignumber.js';
import {BlockNumberPipe} from '@app/shared/pipes/block-number.pipe';

@Resolver('Balance')
@UseInterceptors(SyncingInterceptor)
export class BalanceResolvers {

  constructor(private readonly balanceService: BalanceService) {
  }

  @Query()
  async balances(
    @Args({name: 'addresses', type: () => [String]}, ParseAddressesPipe) addresses: string[],
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
    @Args({name: 'contracts', type: () => [String]}, ParseAddressesPipe) contracts?: string[],
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<BalancePageDto> {

    if (!blockNumber) { // There is no data
      return new BalancePageDto({ items: [], hasMore: false })
    }

    const [items, hasMore] = await this.balanceService.find(addresses, blockNumber, contracts, offset, limit)
    return new BalancePageDto({ items, hasMore })
  }
}
