import { Args, Query, Resolver } from '@nestjs/graphql'
import { ContractService } from '@app/dao/contract.service'
import { ParseAddressPipe } from '@app/shared/validation/parse-address.pipe'
import { ParseLimitPipe } from '@app/shared/validation/parse-limit.pipe'
import { ParsePagePipe } from '@app/shared/validation/parse-page.pipe'
import { ContractDto } from '@app/graphql/contracts/dto/contract.dto'

@Resolver('Contract')
export class ContractResolvers {
  constructor(private readonly contractService: ContractService) {}

  @Query()
  async contractByAddress(@Args('address', ParseAddressPipe) address: string) {
    const entity = await this.contractService.findContractByAddress(address)
    return entity ? new ContractDto(entity) : null
  }

  @Query()
  async contractsCreatedBy(
    @Args('creator', ParseAddressPipe) creator: string,
    @Args('limit', ParseLimitPipe) limit?: number,
    @Args('page', ParsePagePipe) page?: number,
  ) {
    const entities = await this.contractService.findContractsCreatedBy(creator, limit, page)
    return entities.map(e => new ContractDto(e))
  }
}
