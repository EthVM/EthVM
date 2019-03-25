import { Args, Query, Resolver } from '@nestjs/graphql'
import { BalanceService } from '@app/modules/balances/balance.service'
import { BalanceDto } from '@app/modules/balances/balance.dto'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'

@Resolver('Balance')
export class BalanceResolvers {
  constructor(private readonly balanceService: BalanceService) {}

  @Query()
  async balanceByHash(@Args('hash', ParseAddressPipe) hash: string) {
    const entity = await this.balanceService.findBalanceByHash(hash)
    return entity ? new BalanceDto(entity) : null
  }
}
