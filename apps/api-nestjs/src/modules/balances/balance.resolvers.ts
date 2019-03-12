import { Args, Query, Resolver } from '@nestjs/graphql'
import { BalanceService } from '@app/modules/balances/balance.service'

@Resolver('Balance')
export class BalanceResolvers {
  constructor(private readonly balanceService: BalanceService) {}

  @Query()
  async balances(@Args('page') page: number, @Args('limit') limit: number) {
    return await this.balanceService.getBalances(limit, page)
  }

}
