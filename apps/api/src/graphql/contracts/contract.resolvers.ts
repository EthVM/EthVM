import { Args, Query, Resolver } from '@nestjs/graphql'
import { ContractService } from '@app/dao/contract.service'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'
import { ContractDto } from '@app/graphql/contracts/dto/contract.dto'
import { ContractSummaryPageDto } from '@app/graphql/contracts/dto/contract-summary-page.dto'
import { UseInterceptors } from '@nestjs/common'
import { SyncingInterceptor } from '@app/shared/interceptors/syncing-interceptor'

@Resolver('Contract')
@UseInterceptors(SyncingInterceptor)
export class ContractResolvers {
  constructor(private readonly contractService: ContractService) {
  }

  @Query()
  async contractByAddress(@Args('address', ParseAddressPipe) address: string) {
    const entity = await this.contractService.findContractByAddress(address)
    return entity ? new ContractDto(entity) : null
  }

  @Query()
  async contractsCreatedBy(
    @Args('creator', ParseAddressPipe) creator: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ): Promise<ContractSummaryPageDto> {
    const [contractSummaries, totalCount] = await this.contractService.findContractsCreatedBy(creator, offset, limit)
    return new ContractSummaryPageDto(contractSummaries, totalCount)
  }
}
