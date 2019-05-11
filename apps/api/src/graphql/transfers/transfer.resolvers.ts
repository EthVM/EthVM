import { Args, Query, Resolver } from '@nestjs/graphql'
import { TransferService } from '@app/dao/transfer.service'
import {ParseAddressPipe} from '@app/shared/validation/parse-address.pipe'
import {ParseAddressesPipe} from '@app/shared/validation/parse-addresses.pipe'
import {ParseLimitPipe} from '@app/shared/validation/parse-limit.pipe.1'
import {ParsePagePipe} from '@app/shared/validation/parse-page.pipe'
import {TransfersPageDto} from '@app/graphql/transfers/dto/transfers-page.dto'
import {BalancesPageDto} from '@app/graphql/transfers/dto/balances-page.dto'

@Resolver('Transfer')
export class TransferResolvers {

  constructor(private readonly transferService: TransferService) {}

  @Query()
  async tokenTransfersByContractAddress(
    @Args('contractAddress', ParseAddressPipe) contractAddress: string,
    @Args('limit') limit: number,
    @Args('page') page: number,
  ): Promise<TransfersPageDto> {
    const result = await this.transferService.findTokenTransfersByContractAddress(contractAddress, limit, page)
    return new TransfersPageDto({
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
  ): Promise<TransfersPageDto> {
    const result = await this.transferService.findTokenTransfersByContractAddressForHolder(contractAddress, holderAddress, filter, limit, page)
    return new TransfersPageDto({
      items: result[0],
      totalCount: result[1],
    })
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
  ): Promise<TransfersPageDto> {
    const result = await this.transferService.findTokenTransfersByContractAddressesForHolder(contractAddresses, holderAddress, filter, limit, page, timestampFrom, timestampTo)
    return new TransfersPageDto({
      items: result[0],
      totalCount: result[1],
    })
  }

  @Query()
  async internalTransactionsByAddress(
    @Args('address', ParseAddressPipe) address: string,
    @Args('limit') limit: number,
    @Args('page') page: number,
  ): Promise<TransfersPageDto> {
    const result = await this.transferService.findInternalTransactionsByAddress(address, limit, page)
    return new TransfersPageDto({
      items: result[0],
      totalCount: result[1],
    })
  }

  @Query()
  async tokenBalancesByContractAddressesForHolder(
    @Args({name: 'contractAddresses', type: () => [String]}, ParseAddressesPipe) contractAddresses: string[],
    @Args('holderAddress', ParseAddressPipe) holderAddress: string,
    @Args('timestampFrom') timestampFrom: number,
    @Args('timestampTo') timestampTo: number,
  ): Promise<BalancesPageDto> {
    const result = await this.transferService.findTokenBalancesByContractAddressesForHolder(contractAddresses, holderAddress, timestampFrom, timestampTo)
    return new BalancesPageDto({
      items: result[0],
      totalCount: result[1],
    })
  }
}
