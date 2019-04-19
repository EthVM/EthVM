import { Args, Query, Resolver } from '@nestjs/graphql'
import { TransferService } from '@app/modules/transfers/transfer.service'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'
import { ParseLimitPipe } from '@app/shared/validation/parse-limit.pipe'
import { ParsePagePipe } from '@app/shared/validation/parse-page.pipe'
import { TransfersPageDto } from '@app/modules/transfers/dto/transfers-page.dto'
import { TransferDto } from '@app/modules/transfers/dto/transfer.dto'

@Resolver('Transfer')
export class TransferResolvers {

  constructor(private readonly transferService: TransferService) {}

  @Query()
  async tokenTransfersByContractAddress(
    @Args('contractAddress', ParseAddressPipe) contractAddress: string,
    @Args('limit', ParseLimitPipe) limit?: number,
    @Args('page', ParsePagePipe) page?: number
  ): Promise<TransferDto[]> {
    const entities = await this.transferService.findTokenTransfersByContractAddress(contractAddress, limit, page)
    return entities.map(e => new TransferDto(e))
  }

  @Query()
  async tokenTransfersByContractAddressForHolder(
    @Args('contractAddress', ParseAddressPipe) contractAddress: string,
    @Args('holderAddress', ParseAddressPipe) holderAddress: string,
    @Args('filter') filter: string,
    @Args('limit', ParseLimitPipe) limit?: number,
    @Args('page', ParsePagePipe) page?: number
  ): Promise<TransferDto[]> {
    const entities = await this.transferService.findTokenTransfersByContractAddressForHolder(contractAddress, holderAddress, filter, limit, page)
    return entities.map(e => new TransferDto(e))
  }

  @Query()
  async internalTransactionsByAddress(
    @Args('address', ParseAddressPipe) address: string,
    @Args('limit', ParseLimitPipe) limit?: number,
    @Args('page', ParsePagePipe) page?: number
  ): Promise<TransfersPageDto> {
    const result = await this.transferService.findInternalTransactionsByAddress(address, limit, page)
    const transfersPage = {
      items: result[0],
      totalCount: result[1]
    }
    return new TransfersPageDto(transfersPage)
  }
}
