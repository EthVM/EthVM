import { Args, Query, Resolver } from '@nestjs/graphql'
import { TransferService } from '@app/dao/transfer.service'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'
import { ParseAddressesPipe } from '@app/shared/validation/parse-addresses.pipe'
import { TransferPageDto } from '@app/graphql/transfers/dto/transfer-page.dto'
import { BalancesPageDto } from '@app/graphql/transfers/dto/balances-page.dto'
import { UseInterceptors } from '@nestjs/common'
import { SyncingInterceptor } from '@app/shared/interceptors/syncing-interceptor'

@Resolver('Transfer')
@UseInterceptors(SyncingInterceptor)
export class TransferResolvers {

  constructor(private readonly transferService: TransferService) {}

  @Query()
  async tokenTransfersByContractAddress(
    @Args('contractAddress', ParseAddressPipe) contractAddress: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ): Promise<TransferPageDto> {
    const result = await this.transferService.findTokenTransfersByContractAddress(contractAddress, offset, limit)
    return new TransferPageDto({
      items: result[0],
      totalCount: result[1],
    })
  }

  @Query()
  async tokenTransfersByContractAddressForHolder(
    @Args('contractAddress', ParseAddressPipe) contractAddress: string,
    @Args('holderAddress', ParseAddressPipe) holderAddress: string,
    @Args('filter') filter: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ): Promise<TransferPageDto> {
    const result = await this.transferService.findTokenTransfersByContractAddressForHolder(contractAddress, holderAddress, filter, offset, limit)
    return new TransferPageDto({
      items: result[0],
      totalCount: result[1],
    })
  }

  @Query()
  async internalTransactionsByAddress(
    @Args('address', ParseAddressPipe) address: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ): Promise<TransferPageDto> {
    const [items, totalCount] = await this.transferService.findInternalTransactionsByAddress(address, offset, limit)
    return new TransferPageDto({ items, totalCount })
  }

  @Query()
  async tokenTransfersByContractAddressesForHolder(
    @Args({name: 'contractAddresses', type: () => [String]}, ParseAddressesPipe) contractAddresses: string[],
    @Args('holderAddress', ParseAddressPipe) holderAddress: string,
    @Args('filter') filter: string,
    @Args('limit') limit: number,
    @Args('page') page: number,
    @Args('timestampFrom') timestampFrom: number,
    @Args('timestampTo') timestampTo: number,
  ): Promise<TransferPageDto> {
    const result = await this.transferService
      .findTokenTransfersByContractAddressesForHolder(contractAddresses, holderAddress, filter, limit, page, timestampFrom, timestampTo)
    return new TransferPageDto({
      items: result[0],
      totalCount: result[1],
    })
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
}
