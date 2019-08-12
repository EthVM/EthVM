import { Args, Query, Resolver } from '@nestjs/graphql'
import { UseInterceptors } from '@nestjs/common'
import { SyncingInterceptor } from '@app/shared/interceptors/syncing-interceptor'
import { ParseAddressesPipe } from '@app/shared/validation/parse-addresses.pipe'
import { BalanceService } from '@app/dao/balance.service'
import { BalancePageDto } from '@app/graphql/balances/dto/balance-page.dto'

@Resolver('Balance')
@UseInterceptors(SyncingInterceptor)
export class BalanceResolvers {

  constructor(private readonly balanceService: BalanceService) {
  }

  @Query()
  async balances(
    @Args({name: 'addresses', type: () => [String]}, ParseAddressesPipe) addresses: string[],
    @Args({name: 'contracts', type: () => [String]}, ParseAddressesPipe) contracts?: string[],
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<BalancePageDto> {
    const [items, hasMore] = await this.balanceService.find(addresses, contracts, offset, limit)
    return new BalancePageDto({ items, hasMore })
  }
}
