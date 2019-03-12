import { Args, Query, Resolver } from '@nestjs/graphql'
import { BalanceService } from '@app/modules/balances/balance.service'
import { BalanceDto } from '@app/modules/balances/balance.dto'

@Resolver('Balance')
export class BalanceResolvers {
  constructor(private readonly balanceService: BalanceService) {}

  @Query()
  async balanceByHash(@Args('hash') hash: string) {
    const entity = await this.balanceService.findBalanceByHash(hash)
    return entity ? new BalanceDto(entity) : null
  }

}
