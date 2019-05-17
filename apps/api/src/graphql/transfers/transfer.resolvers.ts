import { Args, Query, Resolver } from '@nestjs/graphql'
import { TransferService } from '@app/dao/transfer.service'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'
import { ParseAddressesPipe } from '@app/shared/validation/parse-addresses.pipe'
import { TransferPageDto } from '@app/graphql/transfers/dto/transfer-page.dto'

@Resolver('Transfer')
export class TransferResolvers {

  constructor(private readonly transferService: TransferService) {}

  @Query()
  async tokenTransfersByContractAddress(
    @Args('contractAddress', ParseAddressPipe) contractAddress: string,
    @Args('limit') limit: number,
    @Args('page') page: number,
  ): Promise<TransferPageDto> {
    const result = await this.transferService.findTokenTransfersByContractAddress(contractAddress, limit, page)
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
    @Args('limit') limit: number,
    @Args('page') page: number,
  ): Promise<TransferPageDto> {
    const result = await this.transferService.findTokenTransfersByContractAddressForHolder(contractAddress, holderAddress, filter, limit, page)
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
}
