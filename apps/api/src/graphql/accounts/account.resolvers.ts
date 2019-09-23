import {Args, Query, Resolver} from '@nestjs/graphql'
import {AccountService} from '@app/dao/account.service'
import {AccountDto} from '@app/graphql/accounts/account.dto'
import {UseInterceptors} from '@nestjs/common'
import BigNumber from 'bignumber.js'
import {SyncingInterceptor} from '@app/shared/interceptors/syncing-interceptor'
import {ParseAddressPipe} from '@app/shared/pipes/parse-address.pipe'
import {BlockNumberPipe} from '@app/shared/pipes/block-number.pipe'
import {AddressTransactionCountEntity} from '@app/orm/entities/address-transaction-count.entity';

@Resolver('Account')
@UseInterceptors(SyncingInterceptor)
export class AccountResolvers {
  constructor(private readonly accountService: AccountService) {
  }

  /**
   * Get an account object matching a given address
   * @param {string} address - The address hash to find account info for.
   * @param {BigNumber} [blockNumber=latest block number] - Any account info with a block number higher than this will be ignored.
   * @returns {Promise<AccountDto | undefined>} The account information for this address.
   */
  @Query()
  async accountByAddress(
    @Args('address', ParseAddressPipe) address: string,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<AccountDto | undefined> {

    if (!blockNumber) { // No latest block number was found so there is no valid account info.
      return undefined
    }

    // Find the latest Ether balance entry for this address.
    const balance = await this.accountService.findEtherBalanceByAddress(address, blockNumber)

    if (!balance) { // An Ether balance has not been found for this address so no other info will be available.
      return undefined
    }

    // Find whether this address is a miner.
    const isMiner = await this.accountService.findIsMiner(address, blockNumber)

    // Find the total number of txs (in and out) this address has been involved in.
    const txCounts = await this.accountService.findTransactionCounts(address, blockNumber)
      || new AddressTransactionCountEntity({ total: 0, totalIn: 0, totalOut: 0, address, blockNumber })

    // Find whether this address has created any contracts.
    const isContractCreator = await this.accountService.findIsContractCreator(address, blockNumber)

    // Find whether this address has been involved in any internal transactions.
    const hasInternalTransfers = await this.accountService.findHasInternalTransfers(address, blockNumber)

    // Find whether this address is a contract.
    const isContract = await this.accountService.findIsContract(address, blockNumber)

    // Build tx counts object for mapping in the AccountDto
    const txCountsDto = {
      totalTxCount: txCounts.total,
      inTxCount: txCounts.totalIn,
      outTxCount: txCounts.totalOut,
    }

    // Build and return an AccountDto with all account info combined.
    return new AccountDto(balance, isMiner, isContractCreator, hasInternalTransfers, isContract, txCounts)
  }

}
