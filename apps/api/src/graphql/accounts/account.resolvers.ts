import { Args, Query, Resolver } from '@nestjs/graphql'
import { AccountService } from '@app/dao/account.service'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'
import { AccountDto } from '@app/graphql/accounts/account.dto'

@Resolver('Account')
export class AccountResolvers {
  constructor(private readonly accountService: AccountService) {}

  @Query()
  async accountByAddress(@Args('address', ParseAddressPipe) address: string): Promise<AccountDto | null> {
    const entity = await this.accountService.findAccountByAddress(address)
    return entity ? new AccountDto(entity) : null
  }

}
