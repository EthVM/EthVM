import { Args, Query, Resolver } from '@nestjs/graphql'
import { TransferService } from '@app/dao/transfer.service'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'
import { ParseAddressesPipe } from '@app/shared/validation/parse-addresses.pipe'
import { TransferPageDto } from '@app/graphql/transfers/dto/transfer-page.dto'
import { BalancesPageDto } from '@app/graphql/transfers/dto/balances-page.dto'
import { UseInterceptors } from '@nestjs/common'
import { SyncingInterceptor } from '@app/shared/interceptors/syncing-interceptor'
import { InternalTransferPageDto } from '@app/graphql/transfers/dto/internal-transfer-page.dto'
import BigNumber from 'bignumber.js'
import { FilterEnum } from '@app/graphql/schema'
import { BalanceDeltaPageDto } from '@app/graphql/transfers/dto/balance-delta-page.dto'

@Resolver('Transfer')
@UseInterceptors(SyncingInterceptor)
export class TransferResolvers {

  constructor(private readonly transferService: TransferService) {}

  @Query()
  async tokenTransfersByContractAddress(
    @Args('contractAddress', ParseAddressPipe) contractAddress: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ): Promise<BalanceDeltaPageDto> {
    const [items, hasMore] = await this.transferService.findContractTokenTransfers(contractAddress, offset, limit)
    return new BalanceDeltaPageDto({ items, hasMore })
  }

  @Query()
  async tokenTransfersByContractAddressForHolder(
    @Args('contractAddress', ParseAddressPipe) contractAddress: string,
    @Args('holderAddress', ParseAddressPipe) holderAddress: string,
    @Args('filter') filter: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ): Promise<BalanceDeltaPageDto> {
    const [items, hasMore] = await this.transferService.findContractTokenTransfersForAddress(contractAddress, holderAddress, filter, offset, limit)
    return new BalanceDeltaPageDto({ items, hasMore })
  }

  @Query()
  async totalTokenTransfersByContractAddressForHolder(
    @Args('contractAddress', ParseAddressPipe) contractAddress: string,
    @Args('holderAddress', ParseAddressPipe) holderAddress: string,
  ): Promise<BigNumber> {
    return this.transferService.countContractTokenTransfersForAddress(contractAddress, holderAddress)
  }

  @Query()
  async internalTransactionsByAddress(
    @Args('address', ParseAddressPipe) address: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ): Promise<InternalTransferPageDto> {
    const [items, hasMore] = await this.transferService.findInternalTransactionsForAddress(address, offset, limit)
    return new InternalTransferPageDto({ items, hasMore })
  }

  @Query()
  async tokenBalancesByContractAddressForHolder(
    @Args('contractAddress', ParseAddressPipe) contractAddress: string,
    @Args('holderAddress', ParseAddressPipe) holderAddress: string,
    @Args('timestampFrom') timestampFrom: number,
    @Args('timestampTo') timestampTo: number,
  ): Promise<BalancesPageDto> {
    const result = await this.transferService.findTokenBalancesByContractAddressForHolder(contractAddress, holderAddress, timestampFrom, timestampTo)
    return new BalancesPageDto({
      items: result[0],
      totalCount: result[1],
    })
  }

  @Query()
  async balanceDeltas(
    @Args({name: 'addresses', type: () => [String]}, ParseAddressesPipe) addresses: string[],
    @Args({name: 'contracts', type: () => [String]}, ParseAddressesPipe) contracts?: string[],
    @Args('filter') filter?: FilterEnum,
    @Args('timestampFrom') timestampFrom?: number,
    @Args('timestampTo') timestampTo?: number,
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<BalanceDeltaPageDto> {
    const [items, hasMore] = await this.transferService.findBalanceDeltas(addresses, contracts, filter, timestampTo, timestampFrom, offset, limit)
    return new BalanceDeltaPageDto({ items, hasMore })
  }
}
