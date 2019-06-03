import { Args, Query, Resolver } from '@nestjs/graphql'
import { AccountService } from '@app/dao/account.service'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'
import { AccountDto } from '@app/graphql/accounts/account.dto'

@Resolver('Account')
export class AccountResolvers {
  constructor(private readonly accountService: AccountService) {}

  @Query()
  async accountByAddress(@Args('address', ParseAddressPipe) address: string): Promise<AccountDto | null> {
    const account = await this.accountService.findAccountByAddress(address)
    const isMiner = await this.accountService.findIsMiner(address)
    const isContractCreator = await this.accountService.findIsContractCreator(address)
    return account ? new AccountDto({ ...account, isMiner, isContractCreator }) : null
  }

}
