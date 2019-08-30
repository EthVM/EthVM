import {Args, Query, Resolver} from '@nestjs/graphql'
import {AccountService} from '@app/dao/account.service'
import {AccountDto} from '@app/graphql/accounts/account.dto'
import {UseInterceptors} from '@nestjs/common'
import BigNumber from 'bignumber.js';
import {SyncingInterceptor} from '@app/shared/interceptors/syncing-interceptor';
import {ParseAddressPipe} from '@app/shared/pipes/parse-address.pipe';
import {BlockNumberPipe} from '@app/shared/pipes/block-number.pipe';

@Resolver('Account')
@UseInterceptors(SyncingInterceptor)
export class AccountResolvers {
  constructor(private readonly accountService: AccountService) {
  }

  @Query()
  async accountByAddress(
    @Args('address', ParseAddressPipe) address: string,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<AccountDto | undefined> {
    const balance = await this.accountService.findEtherBalanceByAddress(address, blockNumber)
    if (!balance) {
      return undefined
    }
    const isMiner = await this.accountService.findIsMiner(address, blockNumber)
    const txCounts = await this.accountService.findTransactionCounts(address, blockNumber) || { total: 0, totalIn: 0, totalOut: 0 }
    const isContractCreator = await this.accountService.findIsContractCreator(address, blockNumber)
    const hasInternalTransfers = await this.accountService.findHasInternalTransfers(address, blockNumber)
    const isContract = await this.accountService.findIsContract(address, blockNumber)

    const txCountsDto = {
      totalTxCount: txCounts.total,
      inTxCount: txCounts.totalIn,
      outTxCount: txCounts.totalOut
    }

    return new AccountDto({...balance, isMiner, isContractCreator, hasInternalTransfers, isContract, ...txCountsDto })
  }

}
