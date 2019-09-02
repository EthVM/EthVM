import {Args, Query, Resolver} from '@nestjs/graphql'
import {ContractService} from '@app/dao/contract.service'
import {ParseAddressPipe} from '@app/shared/pipes/parse-address.pipe'
import {ContractDto} from '@app/graphql/contracts/dto/contract.dto'
import {ContractSummaryPageDto} from '@app/graphql/contracts/dto/contract-summary-page.dto'
import {UseInterceptors} from '@nestjs/common'
import {SyncingInterceptor} from '@app/shared/interceptors/syncing-interceptor'
import BigNumber from 'bignumber.js';
import {BlockNumberPipe} from '@app/shared/pipes/block-number.pipe';
import {BlockSummaryPageDto} from '@app/graphql/blocks/dto/block-summary-page.dto';

@Resolver('Contract')
@UseInterceptors(SyncingInterceptor)
export class ContractResolvers {
  constructor(private readonly contractService: ContractService) {
  }

  @Query()
  async contractByAddress(
    @Args('address', ParseAddressPipe) address: string,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
  ): Promise<ContractDto | undefined> {
    if (!blockNumber) { // There is no data
      return undefined
    }
    const entity = await this.contractService.findContractByAddress(address, blockNumber)
    return entity ? new ContractDto(entity) : undefined
  }

  @Query()
  async contractsCreatedBy(
    @Args('creator', ParseAddressPipe) creator: string,
    @Args('blockNumber', BlockNumberPipe) blockNumber: BigNumber,
    @Args('offset') offset?: number,
    @Args('limit') limit?: number,
  ): Promise<ContractSummaryPageDto> {
    if (!blockNumber) { // There is no data
      return new ContractSummaryPageDto([], false, new BigNumber(0))
    }
    const [contractSummaries, hasMore, count] = await this.contractService.findContractsCreatedBy(creator, blockNumber, offset, limit)
    return new ContractSummaryPageDto(contractSummaries, hasMore, count)
  }
}
