import { Args, Query, Resolver } from '@nestjs/graphql'
import { ContractService } from '@app/modules/contracts/contract.service'
import { ContractDto } from '@app/modules/contracts/contract.dto'

@Resolver('Contract')
export class ContractResolvers {
  constructor(private readonly contractService: ContractService) {}

  @Query()
  async contractByHash(@Args('hash') hash: string) {
    const entity = await this.contractService.findContractByHash(hash)
    return entity ? new ContractDto(entity) : null
  }

  @Query()
  async contractsCreatedBy(@Args('creator') creator: string, @Args('limit') limit: number, @Args('page') page: number) {
    const entities = await this.contractService.findContractsCreatedBy(creator, limit, page)
    return entities.map(e => new ContractDto(e))
  }
}
