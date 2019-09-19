import {Args, Query, Resolver} from '@nestjs/graphql'
import {ContractService} from '@app/dao/contract.service'
import {ParseAddressPipe} from '@app/shared/pipes/parse-address.pipe'
import {ContractDto} from '@app/graphql/contracts/dto/contract.dto'
import {ContractSummaryPageDto} from '@app/graphql/contracts/dto/contract-summary-page.dto'
import {UseInterceptors} from '@nestjs/common'
import {SyncingInterceptor} from '@app/shared/interceptors/syncing-interceptor'
import BigNumber from 'bignumber.js'
import {BlockNumberPipe} from '@app/shared/pipes/block-number.pipe'

@Resolver('Contract')
@UseInterceptors(SyncingInterceptor)
export class ContractResolvers {
  constructor(private readonly contractService: ContractService) {
  }

  /**
   * Get a contract by its address.
   * @param {string} address - The address hash of the contract.
   * @param {BigNumber} [blockNumber=latest block number] - Any contracts created at a block number higher than this will be ignored.
   * @returns {Promise<ContractDto | undefined>} A contract matching the given address hash.
   */
  @Query()
  async contractByAddress(
    @Args('address', ParseAddressPipe) address: string,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<ContractDto | undefined> {
    if (!blockNumber) { // No latest block number was found so there are no valid contracts.
      return undefined
    }
    const entity = await this.contractService.findContractByAddress(address, blockNumber)
    return entity ? new ContractDto(entity) : undefined
  }

  /**
   * Get a page of contracts created by a given address hash.
   * @param {string} creator - The address hash of the contract creator.
   * @param {BigNumber} [blockNumber=latest block number] - Any contracts created at a block number higher than this will be ignored.
   * @param {number} [offset] - The number of items to skip.
   * @param {number} [limit] - The page size.
   * @returns {Promise<ContractSummaryPageDto>} A page object with an array of contracts, a boolean representing whether there are more items available and
   * the total count of contracts created (up to the given block number)
   */
  @Query()
  async contractsCreatedBy(
    @Args('creator', ParseAddressPipe) creator: string,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<ContractSummaryPageDto> {
    if (!blockNumber) { // No latest block number was found so there are no valid contracts.
      return new ContractSummaryPageDto([], false, new BigNumber(0))
    }
    const [contractSummaries, hasMore, count] = await this.contractService.findContractsCreatedBy(creator, blockNumber, offset, limit)
    return new ContractSummaryPageDto(contractSummaries, hasMore, count)
  }
}
