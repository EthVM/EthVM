import {Args, Query, Resolver} from '@nestjs/graphql'
import {TransferService} from '@app/dao/transfer.service'
import {ParseAddressPipe} from '@app/shared/pipes/parse-address.pipe'
import {ParseAddressesPipe} from '@app/shared/pipes/parse-addresses.pipe'
import {UseInterceptors} from '@nestjs/common'
import {SyncingInterceptor} from '@app/shared/interceptors/syncing-interceptor'
import BigNumber from 'bignumber.js'
import {FilterEnum} from '@app/graphql/schema'
import {BalanceDeltaPageDto} from '@app/graphql/transfers/dto/balance-delta-page.dto'
import {BlockNumberPipe} from '@app/shared/pipes/block-number.pipe';

@Resolver('Transfer')
@UseInterceptors(SyncingInterceptor)
export class TransferResolvers {

  constructor(private readonly transferService: TransferService) {}

  @Query()
  async tokenTransfersByContractAddress(
    @Args('contractAddress', ParseAddressPipe) contractAddress: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<BalanceDeltaPageDto> {
    const [items, hasMore] = await this.transferService.findContractTokenTransfers(contractAddress, offset, limit, blockNumber)
    return new BalanceDeltaPageDto({ items, hasMore })
  }

  @Query()
  async tokenTransfersByContractAddressForHolder(
    @Args('contractAddress', ParseAddressPipe) contractAddress: string,
    @Args('holderAddress', ParseAddressPipe) holderAddress: string,
    @Args('filter') filter: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<BalanceDeltaPageDto> {
    const [items, hasMore] = await this.transferService.findContractTokenTransfersForAddress(contractAddress, holderAddress, filter, offset, limit, blockNumber)
    return new BalanceDeltaPageDto({ items, hasMore })
  }

  @Query()
  async totalTokenTransfersByContractAddressForHolder(
    @Args('contractAddress', ParseAddressPipe) contractAddress: string,
    @Args('holderAddress', ParseAddressPipe) holderAddress: string,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<BigNumber> {
    return this.transferService.countContractTokenTransfersForAddress(contractAddress, holderAddress, blockNumber)
  }

  @Query()
  async internalTransactionsByAddress(
    @Args('address', ParseAddressPipe) address: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<BalanceDeltaPageDto> {
    const [items, hasMore, totalCount] = await this.transferService.findInternalTransactionsForAddress(address, offset, limit, blockNumber)
    return new BalanceDeltaPageDto({ items, hasMore, totalCount })
  }

  @Query()
  async balanceDeltas(
    @Args({name: 'addresses', type: () => [String]}, ParseAddressesPipe) addresses: string[],
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
    @Args({name: 'contracts', type: () => [String]}, ParseAddressesPipe) contracts?: string[],
    @Args('filter') filter?: FilterEnum,
    @Args('timestampFrom') timestampFrom?: number,
    @Args('timestampTo') timestampTo?: number,
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<BalanceDeltaPageDto> {
    const [items, hasMore] = await this.transferService.findBalanceDeltas(addresses, contracts, filter, offset, limit, blockNumber, timestampTo, timestampFrom)
    return new BalanceDeltaPageDto({ items, hasMore })
  }
}
